# Text Steps

Workbooks allow authors to include text blocks in their workbooks. The text can be human analysis of the telemetry, information to help users interpret the data, section headings, etc. 

![Image showing a text step in workbooks](../Images/TextExample.png)

Text is added through a markdown control - into which an author can add their content. An author can leverage the full formatting capability of markdown to make their documents appear just how they want it. These include different heading and font styles, hyperlinks, tables, etc. This allows authors to create rich Word- or Portal-like reports or analytic narratives.  Text Steps can contain parameter values in the markdown text, and those parameter references will be updated as the parameters change.

#### Edit mode:
![Image showing a text step in workbooks in edit mode](../Images/TextControlInEditMode.png)

#### preview mode:
![Image showing a text step in workbooks in preview mode](../Images/TextControlInEditModePreview.png)

## Add a text step
1. Switch the workbook to edit mode by clicking on the _Edit_ toolbar item.
2. Use the _Add_ button below a step or at the bottom of the workbook, and choose "Add Text" to add a text control to the workbook. 
3. Enter markdown text into the editor field
4. Use the _Text Style_ option to switch between plain markdown, and markdown wrapped with the Azure Portal's standard info/warning/success/error styling.
   > Tip: Use this [markdown cheat sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) to see the different formatting options.
5. Use the Preview tab to see how your content will look. While editing, the preview will show the content inside a scrollable area to limit its size, but when displayed at runtime, the markdown content will expand to fill whatever space it needs, with no scrollbars.
6. Click the _Done Editing_ button to complete editing the step

### Text styles
The following text styles are available for text steps:
style | explanation
---|---
`plain` | No additional formatting is applied
`info` | The portal's "info" style, with a `ℹ` or similar icon and generally blue background
`error` | The portal's "error" style, with a `❌` or similar icon and generally red background
`success` | The portal's "success" style, with a `✔` or similar icon and generally green background
`upsell` | The portal's "upsell" style, with a `🚀` or similar icon and generally purple background
`warning` | The portal's "warning" style, with a `⚠` or similar icon and generally blue background

Instead of picking a specific style, you may also choose a text parameter as the source of the style. The parameter value must be one of the above text values. The absence of a value, or any unrecognized value will be treated as `plain` style.

#### info style example:
![Image showing a text visualization in preview mode showing info style](../Images/TextControlInEditModePreviewInfo.png)

#### warning style example:
![Image showing a text visualization in warning style](../Images/TextExampleWarning.png)
