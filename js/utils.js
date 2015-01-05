"use strict";

function log() {
    if (window.options.logging && window.console && window.console.log) {
        Function.prototype.bind.call(window.console.log, (window.console)).apply(window.console, [(Date.now() - window.logStart) + "ms", "dpe:"].concat([].slice.call(arguments, 0)));
    }
}

if(window.options && window.options.logging){
    window.logging = true;
    window.logStart = Date.now();
}

var Utils = Utils || {
    duplicate : function(el){
        // Duplicate outer node to retain attributes. Then empty.
        var dup = el.cloneNode();
        while(dup.firstChild){
            dup.removeChild(dup.firstChild);
        }
        // Surround each letter with span for animation.
        var str = el.textContent;
        for (var i = 0, len = str.length; i < len; i++) {
            var lSpan = document.createElement('span');
            var l = document.createTextNode(str[i]); 
            lSpan.appendChild(l);
            dup.appendChild(lSpan);
        }
        return dup;
    }
};

Utils.centreColumnContent = function(el){
    var max = 0, bounds, viewportW = document.documentElement.clientWidth;
    [].forEach.call(el.children, function(line){
        line.style.display = 'inline';
        bounds = line.getBoundingClientRect();
        max = Math.max(max, bounds.width);
        line.style.display = null;
    });

    max = Math.min(max, viewportW);
    el.style['width'] = max + "px";
};


// Polyfill for safari, which doesn't seem to support Node.children.
Utils.getChildren = function(childNodes){
    var children = [];
    for(var i = 0, len = childNodes.length; i < len; i++){
        // Collect only nodes that are not text, i.e. are another node.
        if(childNodes[i].nodeName !== '#text'){
            children.push(childNodes[i]);
        }
    }

    return children;
};


Utils.initSlider = function(slider, config){
    var input = slider.querySelector('input[type="range"]'),
        val   = slider.querySelector('.slider-value'),
        label   = slider.getElementsByTagName('label')[0];

    input.setAttribute('min', config.min);
    input.setAttribute('max', config.max);
    input.setAttribute('value', config.value);
    input.setAttribute('step', config.step);

    val.innerHTML = config.value;
    label.innerHTML = config.title;

    input.addEventListener('input', function(e){
        config.cb.call(World, this.value); 
        val.innerHTML = this.value;
    });
};

Utils.initCheckboxes = function(all, selected, container, callback){

    // Word classes.
    var tpl = container.querySelector('.cb-template'),
        clone, cb, label;

    all.forEach(function(cl){
        clone = tpl.cloneNode(true);

        clone.classList.remove('cb-template');
        clone.classList.add('checkbox');

        cb = clone.querySelector('input[type="checkbox"]');

        clone.setAttribute('for', cl);
        // clone.insertBefore(document.createTextNode(cl), clone.firstChild);
        clone.appendChild(document.createTextNode(cl));

        cb.name = cl;
        cb.value = cl;
        cb.id = cl;
        if(selected.indexOf(cl) >= 0){
            cb.checked = true;
        }
        container.appendChild(clone);

        cb.addEventListener('change', function(e){
            callback.call(World, e.target.id, e.target.checked);
        });
    });
};

Utils.setHistory = function(files){
    log(encodeURIComponent(files[0].fullpath));
    var stateObj = files;
    history.pushState(stateObj, "", encodeURIComponent(files[0].fullpath)+'/'+encodeURIComponent(files[1].fullpath));
};
