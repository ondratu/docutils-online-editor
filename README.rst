Docutils `ReStructuredText` online editor
=========================================

This is concept of docutils online editor. Code does not store any document,
but editor append lines to textarea. If rst source is saved (checked), it could
be shown in preview section. If there is some errors, it will be shown over
editor lines.

dependences
-----------

    * docutils
    * docutils-tinywriter (it is simle to use only docutils html4css1 Writer)
    * PoorWSGI as WSGI connector (simple to change to your preferred connector/
      framework)


Simple run
----------

.. code-block:: sh

    pip install docutils                # install dependences
    pip install docutils-tinyhtmlwriter
    pip install PoorWSGI

    git clone https://github.com/ondratu/docutils-online-editor.git
    cd docutils-online-editor
    python src/__init__.py              # run server on http://localhost:8080
