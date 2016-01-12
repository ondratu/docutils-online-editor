Docutils `ReStructuredText` online editor
=========================================

This is concept of docutils online editor. Code does not store any document,
but editor append lines to textarea. If rst source is saved (checked), it could
be shown in preview section. If there is some errors, it will be shown over
editor lines.

This tool needs:

    * docutils
    * docutils-tinwriter (it is simle to use only docutils html4css1 Writer)
    * PoorWSGI as WSGI connector (simple to change to your preferred connector/
      framework)
