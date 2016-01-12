DocutilsEditor = function(source){
    this.$source = $(source);

    this.init();
}

DocutilsEditor.prototype.init = function(){
    this.$source.addClass('rst-source');

    this.$btn_save = $('<a>', {type: 'button', title: 'save'})
            .addClass('btn btn-default')
            .append($('<i>')
                .addClass('fa fa-save'))
            .on('click', this.save.bind(this));
    this.btn_save_color = this.$btn_save.css('color');
    this.$btn_edit = $('<button>', {type: 'button', title: 'edit'})
            .addClass('btn btn-default active')
            .append($('<i>')
                .addClass('fa fa-edit'))
            .on('click', this.edit.bind(this));
    this.btn_edit_color = this.$btn_save.css('color');
    this.$btn_preview = $('<button>', {type: 'button', title: 'preview'})
            .addClass('btn btn-default disabled')
            .append($('<i>')
                .addClass('fa fa-binoculars'))
            .on('click', this.preview.bind(this));

    this.$toolbar = $('<div>')
        .addClass('btn-group')
        .append(this.$btn_save)
        .append(this.$btn_edit)
        .append(this.$btn_preview)
        .insertBefore(this.$source);

    this.$preview = $('<div>')
        .addClass('form-control')
        .css('display', 'none')
        .css('height', this.$source.css('height'))
        .css('overflow', 'auto')
        .insertBefore(this.$source);

    this.$syntax_lines = $('<div>').addClass('lines');
    this.$syntax = $('<div>')
        .addClass('rst-syntax form-control')
        .css('border', '0')
        .css('overflow', 'hidden')
        .append(this.$syntax_lines)
        .insertAfter(this.$source);

    this.syntax_size();
    this.syntax_lines();

    this.$source.on('input', this.input.bind(this));
    this.$source.on('scroll', this.scroll.bind(this));
    // because browser zoom scale each elements different
    $(window).on('resize', this.syntax_size.bind(this));
}

DocutilsEditor.prototype.syntax_size = function(ev){
    this.$syntax
        .css('margin-top', '-' + this.$source.innerHeight()+'px')
        .css('margin-top', '-='+ this.$source.css('border-bottom-width'))
        .css('height', this.$source.innerHeight()+'px')
        .css('height', '-=' + this.$source.css('padding-bottom'))
}

DocutilsEditor.prototype.syntax_lines = function(ev){
    var count = this.$source.val().split('\n').length;
    var lines = this.$syntax_lines.children();
    if (lines.length < count){ // append lines
        var to_add = count - lines.length;
        for (var i = 0; i < to_add; i++){
            this.$syntax_lines.append($('<div>').html(lines.length + i + 1 +':'));
        }
    } else if (lines.length > count) {
        var to_remove = lines.length - count;
        for (var i = 0; i < to_remove; i++){
            this.$syntax_lines.children().last().remove();
        }
    }
}

DocutilsEditor.prototype.scroll = function(ev){
    this.$syntax.scrollTop(this.$source.scrollTop());
}

DocutilsEditor.prototype.preview = function(ev){
    this.$syntax.css('display', 'none');
    this.$source.css('display', 'none');
    this.$preview.css('display', 'block');
    this.$btn_preview.addClass('active');
    this.$btn_edit.removeClass('active');
}

DocutilsEditor.prototype.edit = function(ev){
    this.$preview.css('display', 'none');
    this.$source.css('display', 'block');
    this.$syntax.css('display', 'block');
    this.$btn_edit.addClass('active');
    this.$btn_preview.removeClass('active');
}

DocutilsEditor.prototype.input = function(ev){
    if (this.$btn_save.css('color') == this.btn_save_color){
        this.$btn_save.css('color', 'red');
        this.$btn_edit.css('color', this.btn_edit_color);
        $('div', this.$syntax_lines)
            .removeClass('error-line')
            .tooltip('destroy');
    }
    this.syntax_lines();
}

DocutilsEditor.prototype.save = function(ev){
    $.ajax({url: '/save',
            type: 'post',
            data: {'source': this.$source.val()},
            context: this,
            success: function (data) {
                if (data.html){
                    this.$preview.html(data.html);
                    this.$btn_preview.removeClass('disabled');
                } else {
                    this.$preview.html('');
                    this.$btn_preview.addClass('disabled');
                }

                if (data.errors.length){
                    this.$btn_edit.css('color', 'red');
                    for (var i = 0; i < data.errors.length; i++){
                        error = data.errors[i];
                        line = error[0];
                        type = error[1];
                        level = error[2];
                        text = error[3];

                        var xline = $('div:nth-child('+line+')', this.$syntax_lines);
                        xline.addClass('error-line');
                        xline.tooltip({title: text});
                    }
                } else {
                    this.$btn_edit.css('color', this.btn_edit_color);
                }
                this.$btn_save.css('color', this.btn_save_color);
            },
            error: function(xhr, status, http_status) {
                console.error(http_status);
                alert('ERROR: \nSomething wrong on backend');
            }
        });
}
