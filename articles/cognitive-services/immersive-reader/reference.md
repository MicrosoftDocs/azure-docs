---
title: "Immersive Reader SDK Reference"
titleSuffix: Azure Cognitive Services
description: The Immersive Reader SDK contains a JavaScript library that allows you to integrate the Immersive Reader into your application.
services: cognitive-services
author: metanMSFT
manager: nitinme

ms.service: cognitive-services
ms.subservice: immersive-reader
ms.topic: reference
ms.date: 06/20/2019
ms.author: metan
---

# Immersive Reader JavaScript SDK Reference (v1.1)

The Immersive Reader SDK contains a JavaScript library that allows you to integrate the Immersive Reader into your application.

## Functions

The SDK exposes the functions:

- [`ImmersiveReader.launchAsync(token, subdomain, content, options)`](#launchasync)

- [`ImmersiveReader.close()`](#close)

- [`ImmersiveReader.renderButtons(options)`](#renderbuttons)

## launchAsync

Launches the Immersive Reader within an `iframe` in your web application. Note that the size of your content is limited to a maximum of 50 MB.

```typescript
launchAsync(token: string, subdomain: string, content: Content, options?: Options): Promise<LaunchResponse>;
```

### launchAsync Parameters

| Name | Type | Description |
| ---- | ---- |------------ |
| `token` | string | The Azure AD authentication token. |
| `subdomain` | string | The custom subdomain of your Immersive Reader resource in Azure. |
| `content` | [Content](#content) | An object containing the content to be shown in the Immersive Reader. |
| `options` | [Options](#options) | Options for configuring certain behaviors of the Immersive Reader. Optional. |

### Returns

Returns a `Promise<LaunchResponse>`, which resolves when the Immersive Reader is loaded. The `Promise` resolves to a [`LaunchResponse`](#launchresponse) object.

### Exceptions

The returned `Promise` will be rejected with an [`Error`](#error) object if the Immersive Reader fails to load. For more information, see the [error codes](#error-codes).

## close

Closes the Immersive Reader.

An example use case for this function is if the exit button is hidden by setting ```hideExitButton: true``` in [options](#options). Then, a different button (for example a mobile header's back arrow) can call this ```close``` function when it is clicked.

```typescript
close(): void;
```

## renderButtons

This function styles and updates the document's Immersive Reader button elements. If ```options.elements``` is provided, then this function will render buttons within ```options.elements```. Otherwise, the buttons will be rendered within the document's elements which have the class ```immersive-reader-button```.

This function is automatically called by the SDK when the window loads.

See [Optional Attributes](#optional-attributes) for more rendering options.

```typescript
renderButtons(options?: RenderButtonsOptions): void;
```

### renderButtons Parameters

| Name | Type | Description |
| ---- | ---- |------------ |
| `options` | [RenderButtonsOptions](#renderbuttonsoptions) | Options for configuring certain behaviors of the renderButtons function. Optional. |

## Types

### Content

Contains the content to be shown in the Immersive Reader.

```typescript
{
    title?: string;
    chunks: Chunk[];
}
```

### Content Parameters

| Name | Type | Description |
| ---- | ---- |------------ |
| title | String | Title text shown at the top of the Immersive Reader (optional) |
| chunks | Chunk[] | Array of chunks |

### -title
```yaml
Type: String
Required: false
Default value: "Immersive Reader" 
```

### -chunks
```yaml
Type: Chunk[]
Required: true
Default value: null 
```

### -uiLang
```yaml
Type: String
Required: false
Default value: User's browser language 
```

### Chunk

A single chunk of data, which will be passed into the Content of the Immersive Reader.

```typescript
{
    content: string;
    lang?: string;
    mimeType?: string;
}
```

### Chunk Parameters

| Name | Type | Description |
| ---- | ---- |------------ |
| content | String | Plain text string |
| lang | String | Language of the text, e.g. en, es-ES (optional). Language will be detected automatically if not specified. See [Supported Languages](#supported-languages). |
| mimeType | string | MIME type of the content (optional). Currently 'text/plain', 'application/mathml+xml', and 'text/html' are supported. Defaults to 'text/plain' if not specified. See [Supported MIME types](#supported-mime-types) |

### -content
```yaml
Type: String
Required: true
Default value: null 
```

### -lang
```yaml
Type: String
Required: false
Default value: Automatically detected 
```

### -mimeType
```yaml
Type: String
Required: false
Default value: "text/plain"
```

#### Supported MIME types

| MIME Type | Description |
| --------- | ----------- |
| text/plain | Plain text. |
| text/html | HTML content. [Learn more](#html-support)|
| application/mathml+xml | Mathematical Markup Language (MathML). [Learn more](./how-to/display-math.md).
| application/vnd.openxmlformats-officedocument.wordprocessingml.document | Microsoft Word .docx format document.

## Options

Contains properties that configure certain behaviors of the Immersive Reader.

```typescript
{
    uiLang?: string;
    timeout?: number;
    uiZIndex?: number;
    useWebview?: boolean;
    onExit?: () => any;
    customDomain?: string;
    allowFullscreen?: boolean;
    hideExitButton?: boolean;
    cookiePolicy?: CookiePolicy;
    disableFirstRun?: boolean;
    readAloudOptions?: ReadAloudOptions;
    translationOptions?: TranslationOptions;
    displayOptions?: DisplayOptions;
    preferences?: string;
    onPreferencesChanged?: (value: string) => any;
}
```

### Options Parameters

| Name | Type | Description |
| ---- | ---- |------------ |
| uiLang | String | Language of the UI, e.g. en, es-ES (optional). Defaults to browser language if not specified. |
| timeout | Number | Duration (in milliseconds) before launchAsync fails with a timeout error (default is 15000 ms). |
| uiZIndex | Number | Z-index of the iframe that will be created (default is 1000). |
| useWebview | Boolean| Use a webview tag instead of an iframe, for compatibility with Chrome Apps (default is false). |
| onExit | Function | Executes when the Immersive Reader exits. |
| customDomain | String | Reserved for internal use. Custom domain where the Immersive Reader webapp is hosted (default is null). |
| allowFullscreen | Boolean | The ability to toggle fullscreen (default is true). |
| hideExitButton | Boolean | Whether or not to hide the Immersive Reader's exit button arrow (default is false). This should only be true if there is an alternative mechanism provided to exit the Immersive Reader (e.g a mobile toolbar's back arrow). |
| cookiePolicy | CookiePolicy | Setting for the Immersive Reader's cookie usage (default is *CookiePolicy.Disable*). It's the responsibility of the host application to obtain any necessary user consent in accordance with EU Cookie Compliance Policy. See [Cookie Policy Options](#cookie-policy-options). |
| disableFirstRun | Boolean | Disable the first run experience. |
| readAloudOptions | ReadAloudOptions | Options to configure Read Aloud. See [Read Aloud Options](#read-aloud-options). |
| translationOptions | TranslationOptions | Options to configure translation. See [Translation Options](#translation-options). |
| displayOptions | DisplayOptions | Options to configure text size, font, etc. See [Display Options](#display-options). |
| preferences | String | String returned from onPreferencesChanged representing the user's preferences in the Immersive Reader. See [Settings Parameters](#settings-parameters). |
| onPreferencesChanged | Function | Executes when the user's preferences have changed. |

### -uiLang
```yaml
Type: String
Required: false
Default value: User's browser language 
```

### -timeout
```yaml
Type: Number
Required: false
Default value: 15000
```

### -uiZIndex
```yaml
Type: Number
Required: false
Default value: 1000
```

### -useWebview
```yaml
Type: Boolean
Required: false
Default value: false
Values available: true, false
```

### -onExit
```yaml
Type: Function
Required: false
Default value: null
```

### -customDomain
```yaml
Type: String
Required: false
Default value: null
```

### -allowFullscreen
```yaml
Type: Boolean
Required: false
Default value: true
Values available: true, false
```

### -hideExitButton
```yaml
Type: Boolean
Required: false
Default value: false
Values available: true, false
```

### -disableFirstRun
```yaml
Type: Boolean
Required: false
Default value: false
Values available: true, false
```

### -preferences
```yaml
Type: String
Required: false
Default value: null
```

### -onPreferencesChanged
```yaml
Type: Function
Required: false
Default value: null
```

## Read Aloud Options

```typescript
type ReadAloudOptions = {
    voice?: string;
    speed?: number;
    autoplay?: boolean;
};
```

### Read Aloud Options Parameters

| Name | Type | Description |
| ---- | ---- |------------ |
| voice | String | Voice, either "Female" or "Male". Note that not all languages support both genders. |
| speed | Number | Playback speed, must be between 0.5 and 2.5, inclusive. |
| autoPlay | Boolean | Automatically start Read Aloud when the Immersive Reader loads. |

### -voice
```yaml
Type: String
Required: false
Default value: "Female" or "Male" (determined by language) 
Values available: "Female", "Male"
```

### -speed
```yaml
Type: Number
Required: false
Default value: 1
Values available: 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5
```

### -autoPlay
```yaml
Type: Boolean
Required: false
Default value: false
Values available: true, false
```

> [!NOTE]
> Due to browser limitations, autoplay is not supported in Safari.

## Translation Options

```typescript
type TranslationOptions = {
    language: string;
    autoEnableDocumentTranslation?: boolean;
    autoEnableWordTranslation?: boolean;
};
```

### Translation Options Parameters

| Name | Type | Description |
| ---- | ---- |------------ |
| language | String | Sets the translation language, e.g. fr-FR, es-MX, zh-Hans-CN. Required to automatically enable word or document translation. |
| autoEnableDocumentTranslation | Boolean | Automatically translate the entire document. |
| autoEnableWordTranslation | Boolean | Automatically enable word translation. |

### -language
```yaml
Type: String
Required: true
Default value: null 
Values available: See the Supported Languages section
```

### -autoEnableDocumentTranslation
```yaml
Type: Boolean
Required: false
Default value: false
Values available: true, false
```

### -autoEnableWordTranslation
```yaml
Type: Boolean
Required: false
Default value: false
Values available: true, false
```

## Display Options

```typescript
type DisplayOptions = {
    textSize?: number;
    increaseSpacing?: boolean;
    fontFamily?: string;
};
```

### Display Options Parameters

| Name | Type | Description |
| ---- | ---- |------------ |
| textSize | Number | Sets the chosen text size. |
| increaseSpacing | Boolean | Sets whether text spacing is toggled on or off. |
| fontFamily | String | Sets the chosen font ("Calibri", "ComicSans", or "Sitka"). |

### -textSize
```yaml
Type: Number
Required: false
Default value: 20, 36 or 42 (Determined by screen size)
Values available: 14, 20, 28, 36, 42, 48, 56, 64, 72, 84, 96
```

### -increaseSpacing
```yaml
Type: Boolean
Required: false
Default value: true
Values available: true, false
```

### -fontFamily
```yaml
Type: String
Required: false
Default value: "Calibri"
Values available: "Calibri", "Sitka", "ComicSans"
```

## Cookie Policy Options

```typescript
enum CookiePolicy { Disable, Enable }
```

The Immersive Reader stores its settings, or user preferences, in cookies. This *cookiePolicy* option **disables** the use of cookies by default in order to comply with EU Cookie Compliance laws. Should you want to re-enable cookies and restore the default functionality for Immersive Reader user preferences, you will need to ensure that your website or application obtains the proper consent from the user to enable cookies. Then, to re-enable cookies in the Immersive Reader, you must explicitly set the *cookiePolicy* option to *CookiePolicy.Enable* when launching the Immersive Reader. The table below describes what settings the Immersive Reader stores in its cookie when the *cookiePolicy* option is enabled.

> [!NOTE]
> **IMPORTANT** Do not attempt to programmatically change the values of the settings string sent to and from the Immersive Reader application as this may cause unexpected behavior resulting in a degraded user experience for your customers. Instead, use the *options* exposed by the Immersive Reader SDK in the above sections. The settings listed below are for informational purposes only.

### Settings Parameters

| Setting | Type | Description |
| ------- | ---- | ----------- |
| textSize | Number | Sets the chosen text size. |
| fontFamily | String | Sets the chosen font ("Calibri", "ComicSans", or "Sitka"). |
| textSpacing | Number | Sets whether text spacing is toggled on or off. |
| formattingEnabled | Boolean | Sets whether HTML formatting is toggled on or off. |
| theme | String | Sets the chosen theme (e.g "Light", "Dark"...). |
| syllabificationEnabled | Boolean | Sets whether syllabification toggled on or off. |
| nounHighlightingEnabled | Boolean | that sets whether noun highlighting is toggled on or off. |
| nounHighlightingColor | String | Sets the chosen noun highlighting color. |
| verbHighlightingEnabled | Boolean | Sets whether verb highlighting is toggled on or off. |
| verbHighlightingColor | String | Sets the chosen verb highlighting color. |
| adjectiveHighlightingEnabled | Boolean | Sets whether adjective highlighting is toggled on or off. |
| adjectiveHighlightingColor | String | Sets the chosen adjective highlighting color. |
| adverbHighlightingEnabled | Boolean | Sets whether adverb highlighting is toggled on or off. |
| adverbHighlightingColor | String | Sets the chosen adverb highlighting color. |
| pictureDictionaryEnabled | Boolean | Sets whether Picture Dictionary is toggled on or off. |
| posLabelsEnabled | Boolean | Sets whether the superscript text label of each highlighted Part of Speech is toggled on or off.  |
| readAloudState | Object | Contains two properties: *readAloudSpeed* and *voice*. *readAloudSpeed* is a Number representing the chosen Speed at which text is read aloud, and *voice* is a String that sets the chosen voice gender (Female or Male).  |
| translationState | Object | Contains two properties: *shouldTranslateWords* and *translationLanguage*. *shouldTranslateWords* is a Boolean that sets whether text translation is toggled on or off when the Immersive Reader is loaded and a word is clicked. *translationLanguage* is a String that sets the chosen language in "ll-CC" format |

### -textSize
```yaml
Type: Number
Required: false
Default value: 20, 36 or 42 (Determined by screen size)
Values available: 14, 20, 28, 36, 42, 48, 56, 64, 72, 84, 96
```

### -fontFamily
```yaml
Type: String
Required: false
Default value: "Calibri"
Values available: "Calibri", "ComicSans", "Sitka"
```

### -textSpacing
```yaml
Type: Number
Required: false
Default value: 40
Values available: 24, 40
```

### -formattingEnabled
```yaml
Type: Boolean
Required: false
Default value: true
Values available: true, false
```

### -theme
```yaml
Type: String
Required: false
Default value: "Light"
Values available: "Light", "Dark", "Sepia", "Yellow", "Blue", "Green", "Rose", "Apricot", "LightOrange", "LightYellow", "Lime", "LightGreen", "LightTeal", "Turquoise", "Teal", "SkyBlue", "LightBlue", "Lavender", "Orchid", "Pink", "Carnation"
```

### -syllabificationEnabled
```yaml
Type: Boolean
Required: false
Default value: false
Values available: true, false
```

### -nounHighlightingEnabled
```yaml
Type: Boolean
Required: false
Default value: false
Values available: true, false
```

### -nounHighlightingColor
```yaml
Type: String
Required: false
Default value: "MiddleMagenta"
Values available: "AccessibleBlue", "AccessibleGreen", "AccessibleYellow", "AccessibleOrange", "AccessibleRed", "AccessibleMagenta", "MiddleBlue", "MiddleGreen", "MiddleYellow", "MiddleOrange", "MiddleRed", "MiddleMagenta"
```

### -verbHighlightingEnabled
```yaml
Type: Boolean
Required: false
Default value: false
Values available: true, false
```

### -verbHighlightingColor
```yaml
Type: String
Required: false
Default value: "MiddleRed"
Values available: "AccessibleBlue", "AccessibleGreen", "AccessibleYellow", "AccessibleOrange", "AccessibleRed", "AccessibleMagenta", "MiddleBlue", "MiddleGreen", "MiddleYellow", "MiddleOrange", "MiddleRed", "MiddleMagenta"
```

### -adjectiveHighlightingEnabled
```yaml
Type: Boolean
Required: false
Default value: false
Values available: true, false
```

### -adjectiveHighlightingColor
```yaml
Type: String
Required: false
Default value: "MiddleGreen"
Values available: "AccessibleBlue", "AccessibleGreen", "AccessibleYellow", "AccessibleOrange", "AccessibleRed", "AccessibleMagenta", "MiddleBlue", "MiddleGreen", "MiddleYellow", "MiddleOrange", "MiddleRed", "MiddleMagenta"
```

### -adverbHighlightingEnabled
```yaml
Type: Boolean
Required: false
Default value: false
Values available: true, false
```

### -adverbHighlightingColor
```yaml
Type: String
Required: false
Default value: "MiddleYellow"
Values available: "AccessibleBlue", "AccessibleGreen", "AccessibleYellow", "AccessibleOrange", "AccessibleRed", "AccessibleMagenta", "MiddleBlue", "MiddleGreen", "MiddleYellow", "MiddleOrange", "MiddleRed", "MiddleMagenta"
```

### -pictureDictionaryEnabled
```yaml
Type: Boolean
Required: false
Default value: true
Values available: true, false
```

### -posLabelsEnabled
```yaml
Type: Boolean
Required: false
Default value: true
Values available: true, false
```

### -readAloudState
```yaml
Type: Object
Required: false
Properties available: 2

Property 1 name: readAloudSpeed
Property 1 type: Number
Property 1 required: true
Property 1 default value: 1
Property 1 values available: 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5

Property 2 name: voice
Property 2 type: String
Property 2 required: true
Property 2 default: "Female" or "Male" (determined by language) 
Property 2 values available: "Female", "Male"
```

### -translationState
```yaml
Type: Object
Required: false
Properties available: 2

Property 1 name: shouldTranslateWords
Property 1 type: Boolean
Property 1 required: true
Property 1 default value: false
Property 1 values available: true, false

Property 2 name: translationLanguage
Property 2 type: String
Property 2 required: true
Property 2 default value: null
Property 2 values available: See the Supported Languages section
```

## Supported Languages

The translation feature of Immersive Reader supports many languages. See [this article](https://www.onenote.com/learningtools/languagesupport) for more details.

## LaunchResponse

Contains the response from the call to `ImmersiveReader.launchAsync`. Note that a reference to the `iframe` that contains the Immersive Reader can be accessed via `container.firstChild`.

```typescript
{
    container: HTMLDivElement;
    sessionId: string;
}
```

### LaunchResponse Parameters

| Setting | Type | Description |
| ------- | ---- | ----------- |
| container | HTMLDivElement | HTML element which contains the Immersive Reader iframe. |
| sessionId | String | Globally unique identifier for this session, used for debugging. |

### -container
```yaml
Type: HTMLDivElement
Required: true
```

### -sessionId
```yaml
Type: String
Required: true
```
 
## Error

Contains information about an error.

```typescript
{
    code: string;
    message: string;
}
```

### Error Parameters

| Setting | Type | Description |
| ------- | ---- | ----------- |
| code | String | One of a set of error codes. See [Error codes](#error-codes). |
| message | String | Human-readable representation of the error. |

### -code
```yaml
Type: String
Required: true
```

### -message
```yaml
Type: String
Required: true
```

#### Error codes

| Code | Description |
| ---- | ----------- |
| BadArgument | Supplied argument is invalid, see `message` for details. |
| Timeout | The Immersive Reader failed to load within the specified timeout. |
| TokenExpired | The supplied token is expired. |
| Throttled | The call rate limit has been exceeded. |

## RenderButtonsOptions

Options for rendering the Immersive Reader buttons.

```typescript
{
    elements: HTMLDivElement[];
}
```

### RenderButtonsOptions Parameters

| Setting | Type | Description |
| ------- | ---- | ----------- |
| elements | HTMLDivElement[] | Elements to render the Immersive Reader buttons in. |

### -elements
```yaml
Type: HTMLDivElement[]
Required: true
```

## Launching the Immersive Reader

The SDK provides default styling for the button for launching the Immersive Reader. Use the `immersive-reader-button` class attribute to enable this styling. See [this article](./how-to-customize-launch-button.md) for more details.

```html
<div class='immersive-reader-button'></div>
```

### Optional attributes

Use the following attributes to configure the look and feel of the button.

| Attribute | Description |
| --------- | ----------- |
| `data-button-style` | Sets the style of the button. Can be `icon`, `text`, or `iconAndText`. Defaults to `icon`. |
| `data-locale` | Sets the locale. For example, `en-US` or `fr-FR`. Defaults to English `en`. |
| `data-icon-px-size` | Sets the size of the icon in pixels. Defaults to 20px. |

## HTML support

When formatting is enabled, the following content will be rendered as HTML in the Immersive Reader.

| HTML | Supported Content |
| --------- | ----------- |
| Font Styles | Bold, Italic, Underline, Code, Strikethrough, Superscript, Subscript |
| Unordered Lists | Disc, Circle, Square |
| Ordered Lists | Decimal, Upper-Alpha, Lower-Alpha, Upper-Roman, Lower-Roman |

Unsupported tags will be rendered comparably. Images and tables are currently not supported.

## Browser support

Use the most recent versions of the following browsers for the best experience with the Immersive Reader.

* Microsoft Edge
* Internet Explorer 11
* Google Chrome
* Mozilla Firefox
* Apple Safari

## Next steps

* Explore the [Immersive Reader SDK on GitHub](https://github.com/microsoft/immersive-reader-sdk)
* [Quickstart: Create a web app that launches the Immersive Reader (C#)](./quickstarts/client-libraries.md?pivots=programming-language-csharp)
