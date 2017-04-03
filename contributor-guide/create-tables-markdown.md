# Create tables in markdown
The simplest way to create a table in markdown is to use pipes and lines.

 ![][1]

You can justify the columns with colons:

    |-----:| - this is right aligned
    |:-----| -  this is left aligned
    |:-----:| - this is centered

You can create a table without a header. For example, to create a multi-column list:

```
|   |   |
| - | - |
| This | table |
| has no | header |
```

If you use HTML tables and your markdown is not rendering between the two tables, you need to add a closing BR tag after the closing TABLE tag.

![2]

For more information about how to create tables in markdown, see:

* Markdown tables generator: http://www.tablesgenerator.com/markdown_tables
* https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#wiki-tables
* http://michelf.ca/projects/php-markdown/extra/#table

### Contributors' Guide Links
* [Overview article](../README.md)
* [Index of guidance articles](contributor-guide-index.md)

<!--image references-->
[1]: ./media/create-tables-markdown/table-markdown.png
[2]: ./media/create-tables-markdown/break-tables.png
