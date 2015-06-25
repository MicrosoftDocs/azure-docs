<properties 
    pageTitle="Create images in markdown" 
    description="Explains how to create images in markdown according to guidelines set for the Azure repositories." 
    services="" 
    solutions="" 
    documentationCenter="" 
    authors="kenhoff" 
    manager="ilanas" 
    editor="tysonn"/>

<tags 
    ms.service="contributor-guide" 
    ms.devlang="" 
    ms.topic="article" 
    ms.tgt_pltfrm="" 
    ms.workload="" 
    ms.date="06/25/2015" 
    ms.author="kenhoff" />

# Create images in markdown

## Guidelines specific to azure.microsoft.com

Screenshots are currently encouraged if it's not possible to include repro steps. Do write your content so that the content can stand without the screenshots if necessary. Including lots of screenshots but authoring the text to stand on its own will help us mitigate future cost/localizability issues in this content set. 

Use the following guidelines when creating and including art files:
- Do not share art files across documents. Copy the file you need and add it to the media folder for your specific topic. Sharing between files is discouraged because  it is easier to remove deprecated content and images which keeps the repo clean. It accommodates the GitHub contribution link and outside contributor usage. 

- .png files are highly preferred over other formats.

- Use red squares of the default width provided in Paint (5 px) to call attention to particular elements in screenshots.

- When it makes sense, feel free to crop images so the UI elements will be displayed in full size. Make sure that the context is clear to users, though.

- If you crop a screenshot in a way that leaves white background at the edges, add a single pixel gray border around the image.  If using Paint, use the lighter gray in the default color pallete (0xC3C3C3). If using some other graphic app, the RGB color is R195, G195, 195. You can easily add a gray border around an image in Visio--to do this, select the image, select Line, and ensure the the correct color is set, and then change the line weight to 1 1/2 pt.  Screenshots should have a 1-pixel-wide gray border so that white areas of the screenshot do not blur into the web page.

- Images will be automatically resized if they are too wide. However, the resizing sometimes causes fuzziness, so we recommend that you limit the width of your images to 780 px, and manually resize images before submission if necessary.

- If your article includes steps where the user is working within a shell, it's useful to show command output in screenshots. In this case, restricting your shell width to about 72 characters generally ensures that your image will remain within the 780 px width guideline. Before taking a screenshot of output, resize the window so that just the relevant command and output is shown (optionally with a blank line on either side). this keeps the screenshots a reasonable height, and avoids making the article seem longer than it really is.  

- When taking a screenshot of a browser window, whenever possible include some or all of the browser chrome in the screenshot. When possible, resize your browser window to 780 px wide or less, and keep the height of the browser window as short as possible such that your application fits within the window. 

- If you are taking screenshots on Windows machine that is running an Aero theme, either turn off transparency or be very careful to not include distracting text or images behind any transparent borders that are included in your screenshots.

- Screenshots cannot contain any internal URLs, test accounts, or other internal Microsoft information. Consider taking screenshots with the URL cut off if that is possible - include the appropriate URL in the surrounding text if it makes sense. Change accounts to use fictitious company names, domains, and people names from the LCA list.  Therefore, modify the screenshot so that it contains:
    -   Appropriate fictitious account names. 
    -   Production portal URLs
    -   Production storage account URLs
    -   Production service management URLs (RDFE)
    -   Only released software and services

- Your content scenario might require you to show something like a final resulting app running in a browser; or, your scenario may require you to make it obvious that the portal or app is running in a browser on a Mac. In these case, if preview or internal URLs are shown, ensure that you: 
    - Enter a fake production URL before taking the screenshot (preferred option)
    - Blur/block the URL 

- In conceptual art or diagrams, use the official icons in the Cloud and Enterprise symbol and icon set. 
    -   Internal employees use this set of assets http://aka.ms/CnESymbolsINT 
    -   A public set is available for customers at http://aka.ms/CnESymbols

- It is the content author's responsibility to make the necessary changes to screenshots using Paint, PowerPoint, or other appropriate programs. If your organization has an graphic artist, you may be able to work with the graphic artist.

## Image folder creation and link syntax

To use images in your ACOM article, you will first need to create a folder in the `./articles/service-directory/media/article-name/` directory. 

For example, `./articles/app-service/media/app-service-enterprise-multichannel-apps/`.

After you've created the folder and added images to it, use the following syntax to create images in your article:

```
![Alt image text](./media/article-name/your-image-filename.png)
```
Example: 

See [the markdown template](https://raw.githubusercontent.com/Azure/azure-content-pr/master/markdown%20templates/markdown-template-for-new-articles.md) for an example.  The image call references in this markdown template are designed so the calls are made to image references at the bottom of the template. 

###Contributors' Guide Links

- [Overview article](./../README.md)
- [Index of guidance articles](./contributor-guide-index.md)
