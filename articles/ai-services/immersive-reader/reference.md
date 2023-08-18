---
title: "Immersive Reader SDK Reference"
titleSuffix: Azure AI services
description: The Immersive Reader SDK contains a JavaScript library that allows you to integrate the Immersive Reader into your application.
services: cognitive-services
author: rwallerms
manager: nitinme

ms.service: applied-ai-services
ms.subservice: immersive-reader
ms.custom: devx-track-js
ms.topic: reference
ms.date: 11/15/2021
ms.author: rwaller
---

# Immersive Reader JavaScript SDK Reference (v1.2)

The Immersive Reader SDK contains a JavaScript library that allows you to integrate the Immersive Reader into your application.

You may use `npm`, `yarn`, or an `HTML` `<script>` element to include the library of the latest stable build in your web application:

```html
<script type='text/javascript' src='https://ircdname.azureedge.net/immersivereadersdk/immersive-reader-sdk.1.2.0.js'></script>
```

```bash
npm install @microsoft/immersive-reader-sdk
```

```bash
yarn add @microsoft/immersive-reader-sdk
```

## Functions

The SDK exposes the functions:

- [`ImmersiveReader.launchAsync(token, subdomain, content, options)`](#launchasync)

- [`ImmersiveReader.close()`](#close)

- [`ImmersiveReader.renderButtons(options)`](#renderbuttons)

<br>

## launchAsync

Launches the Immersive Reader within an `HTML` `iframe` element in your web application. The size of your content is limited to a maximum of 50 MB.

```typescript
launchAsync(token: string, subdomain: string, content: Content, options?: Options): Promise<LaunchResponse>;
```

#### launchAsync Parameters

| Name | Type | Description |
| ---- | ---- |------------ |
| `token` | string | The Azure AD authentication token. For more information, see [How-To Create an Immersive Reader Resource](./how-to-create-immersive-reader.md). |
| `subdomain` | string | The custom subdomain of your Immersive Reader resource in Azure. For more information, see [How-To Create an Immersive Reader Resource](./how-to-create-immersive-reader.md). |
| `content` | [Content](#content) | An object containing the content to be shown in the Immersive Reader. |
| `options` | [Options](#options) | Options for configuring certain behaviors of the Immersive Reader. Optional. |

#### Returns

Returns a `Promise<LaunchResponse>`, which resolves when the Immersive Reader is loaded. The `Promise` resolves to a [`LaunchResponse`](#launchresponse) object.

#### Exceptions

The returned `Promise` will be rejected with an [`Error`](#error) object if the Immersive Reader fails to load. For more information, see the [error codes](#error-codes).

<br>

## close

Closes the Immersive Reader.

An example use case for this function is if the exit button is hidden by setting ```hideExitButton: true``` in [options](#options). Then, a different button (for example a mobile header's back arrow) can call this ```close``` function when it's clicked.

```typescript
close(): void;
```

<br>

## Immersive Reader Launch Button

The SDK provides default styling for the button for launching the Immersive Reader. Use the `immersive-reader-button` class attribute to enable this styling. For more information, see [How-To Customize the Immersive Reader button](./how-to-customize-launch-button.md).

```html
<div class='immersive-reader-button'></div>
```

#### Optional attributes

Use the following attributes to configure the look and feel of the button.

| Attribute | Description |
| --------- | ----------- |
| `data-button-style` | Sets the style of the button. Can be `icon`, `text`, or `iconAndText`. Defaults to `icon`. |
| `data-locale` | Sets the locale. For example, `en-US` or `fr-FR`. Defaults to English `en`. |
| `data-icon-px-size` | Sets the size of the icon in pixels. Defaults to 20px. |

<br>

## renderButtons

The ```renderButtons``` function isn't necessary if you're using the [How-To Customize the Immersive Reader button](./how-to-customize-launch-button.md) guidance.

This function styles and updates the document's Immersive Reader button elements. If ```options.elements``` is provided, then the buttons will be rendered within each element provided in ```options.elements```. Using the ```options.elements``` parameter is useful when you have multiple sections in your document on which to launch the Immersive Reader, and want a simplified way to render multiple buttons with the same styling, or want to render the buttons with a simple and consistent design pattern. To use this function with the [renderButtons options](#renderbuttons-options) parameter, call ```ImmersiveReader.renderButtons(options: RenderButtonsOptions);``` on page load as demonstrated in the below code snippet. Otherwise, the buttons will be rendered within the document's elements that have the class ```immersive-reader-button``` as shown in [How-To Customize the Immersive Reader button](./how-to-customize-launch-button.md).

```typescript
// This snippet assumes there are two empty div elements in
// the page HTML, button1 and button2.
const btn1: HTMLDivElement = document.getElementById('button1');
const btn2: HTMLDivElement = document.getElementById('button2');
const btns: HTMLDivElement[] = [btn1, btn2];
ImmersiveReader.renderButtons({elements: btns});
```

See the above [Optional Attributes](#optional-attributes) for more rendering options. To use these options, add any of the option attributes to each ```HTMLDivElement``` in your page HTML.

```typescript
renderButtons(options?: RenderButtonsOptions): void;
```

#### renderButtons Parameters

| Name | Type | Description |
| ---- | ---- |------------ |
| `options` | [renderButtons options](#renderbuttons-options) | Options for configuring certain behaviors of the renderButtons function. Optional. |

### renderButtons Options

Options for rendering the Immersive Reader buttons.

```typescript
{
    elements: HTMLDivElement[];
}
```

#### renderButtons Options Parameters

| Setting | Type | Description |
| ------- | ---- | ----------- |
| elements | HTMLDivElement[] | Elements to render the Immersive Reader buttons in. |

##### `elements`
```Parameters
Type: HTMLDivElement[]
Required: false
```

<br>

## LaunchResponse

Contains the response from the call to `ImmersiveReader.launchAsync`. A reference to the `HTML` `iframe` element that contains the Immersive Reader can be accessed via `container.firstChild`.

```typescript
{
    container: HTMLDivElement;
    sessionId: string;
    charactersProcessed: number;
}
```

#### LaunchResponse Parameters

| Setting | Type | Description |
| ------- | ---- | ----------- |
| container | HTMLDivElement | HTML element that contains the Immersive Reader `iframe` element. |
| sessionId | String | Globally unique identifier for this session, used for debugging. |
| charactersProcessed | number | Total number of characters processed |
 
## Error

Contains information about an error.

```typescript
{
    code: string;
    message: string;
}
```

#### Error Parameters

| Setting | Type | Description |
| ------- | ---- | ----------- |
| code | String | One of a set of error codes. For more information, see [Error codes](#error-codes). |
| message | String | Human-readable representation of the error. |

#### Error codes

| Code | Description |
| ---- | ----------- |
| BadArgument | Supplied argument is invalid, see `message` parameter of the [Error](#error). |
| Timeout | The Immersive Reader failed to load within the specified timeout. |
| TokenExpired | The supplied token is expired. |
| Throttled | The call rate limit has been exceeded. |

<br>

## Types

### Content

Contains the content to be shown in the Immersive Reader.

```typescript
{
    title?: string;
    chunks: Chunk[];
}
```

#### Content Parameters

| Name | Type | Description |
| ---- | ---- |------------ |
| title | String | Title text shown at the top of the Immersive Reader (optional) |
| chunks | [Chunk[]](#chunk) | Array of chunks |

##### `title`
```Parameters
Type: String
Required: false
Default value: "Immersive Reader" 
```

##### `chunks`
```Parameters
Type: Chunk[]
Required: true
Default value: null 
```

<br>

### Chunk

A single chunk of data, which will be passed into the Content of the Immersive Reader.

```typescript
{
    content: string;
    lang?: string;
    mimeType?: string;
}
```

#### Chunk Parameters

| Name | Type | Description |
| ---- | ---- |------------ |
| content | String | The string that contains the content sent to the Immersive Reader. |
| lang | String | Language of the text, the value is in IETF BCP 47-language tag format, for example, en, es-ES. Language will be detected automatically if not specified. For more information, see [Supported Languages](#supported-languages). |
| mimeType | string | Plain text, MathML, HTML & Microsoft Word DOCX formats are supported. For more information, see [Supported MIME types](#supported-mime-types). |

##### `content`
```Parameters
Type: String
Required: true
Default value: null 
```

##### `lang`
```Parameters
Type: String
Required: false
Default value: Automatically detected 
```

##### `mimeType`
```Parameters
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


<br>

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
    parent?: Node; 
    hideExitButton?: boolean;
    cookiePolicy?: CookiePolicy;
    disableFirstRun?: boolean;
    readAloudOptions?: ReadAloudOptions;
    translationOptions?: TranslationOptions;
    displayOptions?: DisplayOptions;
    preferences?: string;
    onPreferencesChanged?: (value: string) => any;
    disableGrammar?: boolean;
    disableTranslation?: boolean;
    disableLanguageDetection?: boolean;
}
```

#### Options Parameters

| Name | Type | Description |
| ---- | ---- |------------ |
| uiLang | String | Language of the UI, the value is in IETF BCP 47-language tag format, for example, en, es-ES. Defaults to browser language if not specified. |
| timeout | Number | Duration (in milliseconds) before [launchAsync](#launchasync) fails with a timeout error (default is 15,000 ms). This timeout only applies to the initial launch of the Reader page, when the Reader page opens successfully and the spinner starts. Adjustment of the timeout should'nt be necessary. |
| uiZIndex | Number | Z-index of the `HTML` `iframe` element that will be created (default is 1000). |
| useWebview | Boolean| Use a webview tag instead of an `HTML` `iframe` element, for compatibility with Chrome Apps (default is false). |
| onExit | Function | Executes when the Immersive Reader exits. |
| customDomain | String | Reserved for internal use. Custom domain where the Immersive Reader webapp is hosted (default is null). |
| allowFullscreen | Boolean | The ability to toggle fullscreen (default is true). |
| parent | Node | Node in which the `HTML` `iframe` element or `Webview` container is placed. If the element doesn't exist, iframe is placed in `body`. |
| hideExitButton | Boolean | Hides the Immersive Reader's exit button arrow (default is false). This value should only be true if there's an alternative mechanism provided to exit the Immersive Reader (e.g a mobile toolbar's back arrow). |
| cookiePolicy | [CookiePolicy](#cookiepolicy-options) | Setting for the Immersive Reader's cookie usage (default is *CookiePolicy.Disable*). It's the responsibility of the host application to obtain any necessary user consent following EU Cookie Compliance Policy. For more information, see [Cookie Policy Options](#cookiepolicy-options). |
| disableFirstRun | Boolean | Disable the first run experience. |
| readAloudOptions | [ReadAloudOptions](#readaloudoptions) | Options to configure Read Aloud. |
| translationOptions | [TranslationOptions](#translationoptions) | Options to configure translation. |
| displayOptions | [DisplayOptions](#displayoptions) | Options to configure text size, font, theme, and so on. |
| preferences | String | String returned from onPreferencesChanged representing the user's preferences in the Immersive Reader. For more information, see [Settings Parameters](#settings-parameters) and [How-To Store User Preferences](./how-to-store-user-preferences.md). |
| onPreferencesChanged | Function | Executes when the user's preferences have changed. For more information, see [How-To Store User Preferences](./how-to-store-user-preferences.md). |
| disableTranslation | Boolean | Disable the word and document translation experience. |
| disableGrammar | Boolean | Disable the Grammar experience. This option will also disable Syllables, Parts of Speech and Picture Dictionary, which depends on Parts of Speech. |
| disableLanguageDetection | Boolean | Disable Language Detection to ensure the Immersive Reader only uses the language that is explicitly specified on the [Content](#content)/[Chunk[]](#chunk). This option should be used sparingly, primarily in situations where language detection isn't working, for instance, this issue is more likely to happen with short passages of fewer than 100 characters. You should be certain about the language you're sending, as text-to-speech won't have the correct voice. Syllables, Parts of Speech and Picture Dictionary won't work correctly if the language isn't correct. |

##### `uiLang`
```Parameters
Type: String
Required: false
Default value: User's browser language 
```

##### `timeout`
```Parameters
Type: Number
Required: false
Default value: 15000
```

##### `uiZIndex`
```Parameters
Type: Number
Required: false
Default value: 1000
```

##### `onExit`
```Parameters
Type: Function
Required: false
Default value: null
```

##### `preferences`

> [!CAUTION]
> **IMPORTANT** Do not attempt to programmatically change the values of the `-preferences` string sent to and from the Immersive Reader application as this may cause unexpected behavior resulting in a degraded user experience for your customers. Host applications should never assign a custom value to or manipulate the `-preferences` string. When using the `-preferences` string option, use only the exact value that was returned from the `-onPreferencesChanged` callback option.

```Parameters
Type: String
Required: false
Default value: null
```

##### `onPreferencesChanged`
```Parameters
Type: Function
Required: false
Default value: null
```

##### `customDomain`
```Parameters
Type: String
Required: false
Default value: null
```

<br>

## ReadAloudOptions

```typescript
type ReadAloudOptions = {
    voice?: string;
    speed?: number;
    autoplay?: boolean;
};
```

#### ReadAloudOptions Parameters

| Name | Type | Description |
| ---- | ---- |------------ |
| voice | String | Voice, either "Female" or "Male". Not all languages support both genders. |
| speed | Number | Playback speed, must be between 0.5 and 2.5, inclusive. |
| autoPlay | Boolean | Automatically start Read Aloud when the Immersive Reader loads. |

##### `voice`
```Parameters
Type: String
Required: false
Default value: "Female" or "Male" (determined by language) 
Values available: "Female", "Male"
```

##### `speed`
```Parameters
Type: Number
Required: false
Default value: 1
Values available: 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5
```

> [!NOTE]
> Due to browser limitations, autoplay is not supported in Safari.

<br>

## TranslationOptions

```typescript
type TranslationOptions = {
    language: string;
    autoEnableDocumentTranslation?: boolean;
    autoEnableWordTranslation?: boolean;
};
```

#### TranslationOptions Parameters

| Name | Type | Description |
| ---- | ---- |------------ |
| language | String | Sets the translation language, the value is in IETF BCP 47-language tag format, for example, fr-FR, es-MX, zh-Hans-CN. Required to automatically enable word or document translation. |
| autoEnableDocumentTranslation | Boolean | Automatically translate the entire document. |
| autoEnableWordTranslation | Boolean | Automatically enable word translation. |

##### `language`
```Parameters
Type: String
Required: true
Default value: null 
Values available: For more information, see the Supported Languages section
```

<br>

## ThemeOption

```typescript
enum ThemeOption { Light, Dark }
```

## DisplayOptions

```typescript
type DisplayOptions = {
    textSize?: number;
    increaseSpacing?: boolean;
    fontFamily?: string;
    themeOption?: ThemeOption
};
```

#### DisplayOptions Parameters

| Name | Type | Description |
| ---- | ---- |------------ |
| textSize | Number | Sets the chosen text size. |
| increaseSpacing | Boolean | Sets whether text spacing is toggled on or off. |
| fontFamily | String | Sets the chosen font ("Calibri", "ComicSans", or "Sitka"). |
| themeOption | ThemeOption | Sets the chosen Theme of the reader ("Light", "Dark"). |

##### `textSize`
```Parameters
Type: Number
Required: false
Default value: 20, 36 or 42 (Determined by screen size)
Values available: 14, 20, 28, 36, 42, 48, 56, 64, 72, 84, 96
```

##### `fontFamily`
```Parameters
Type: String
Required: false
Default value: "Calibri"
Values available: "Calibri", "Sitka", "ComicSans"
```

<br>

## CookiePolicy Options

```typescript
enum CookiePolicy { Disable, Enable }
```

**The settings listed below are for informational purposes only**. The Immersive Reader stores its settings, or user preferences, in cookies. This *cookiePolicy* option **disables** the use of cookies by default to follow EU Cookie Compliance laws. If you want to re-enable cookies and restore the default functionality for Immersive Reader user preferences, your website or application will need proper consent from the user to enable cookies. Then, to re-enable cookies in the Immersive Reader, you must explicitly set the *cookiePolicy* option to *CookiePolicy.Enable* when launching the Immersive Reader. The table below describes what settings the Immersive Reader stores in its cookie when the *cookiePolicy* option is enabled.

#### Settings Parameters

| Setting | Type | Description |
| ------- | ---- | ----------- |
| textSize | Number | Sets the chosen text size. |
| fontFamily | String | Sets the chosen font ("Calibri", "ComicSans", or "Sitka"). |
| textSpacing | Number | Sets whether text spacing is toggled on or off. |
| formattingEnabled | Boolean | Sets whether HTML formatting is toggled on or off. |
| theme | String | Sets the chosen theme (e.g "Light", "Dark"...). |
| syllabificationEnabled | Boolean | Sets whether syllabification toggled on or off. |
| nounHighlightingEnabled | Boolean | Sets whether noun-highlighting is toggled on or off. |
| nounHighlightingColor | String | Sets the chosen noun-highlighting color. |
| verbHighlightingEnabled | Boolean | Sets whether verb-highlighting is toggled on or off. |
| verbHighlightingColor | String | Sets the chosen verb-highlighting color. |
| adjectiveHighlightingEnabled | Boolean | Sets whether adjective-highlighting is toggled on or off. |
| adjectiveHighlightingColor | String | Sets the chosen adjective-highlighting color. |
| adverbHighlightingEnabled | Boolean | Sets whether adverb-highlighting is toggled on or off. |
| adverbHighlightingColor | String | Sets the chosen adverb-highlighting color. |
| pictureDictionaryEnabled | Boolean | Sets whether Picture Dictionary is toggled on or off. |
| posLabelsEnabled | Boolean | Sets whether the superscript text label of each highlighted Part of Speech is toggled on or off.  |

<br>

## Supported Languages

The translation feature of Immersive Reader supports many languages. For more information, see [Language Support](./language-support.md).

<br>

## HTML support

When formatting is enabled, the following content will be rendered as HTML in the Immersive Reader.

| HTML | Supported Content |
| --------- | ----------- |
| Font Styles | Bold, Italic, Underline, Code, Strikethrough, Superscript, Subscript |
| Unordered Lists | Disc, Circle, Square |
| Ordered Lists | Decimal, Upper-Alpha, Lower-Alpha, Upper-Roman, Lower-Roman |

Unsupported tags will be rendered comparably. Images and tables are currently not supported.

<br>

## Browser support

Use the most recent versions of the following browsers for the best experience with the Immersive Reader.

* Microsoft Edge
* Internet Explorer 11
* Google Chrome
* Mozilla Firefox
* Apple Safari

<br>

## Next steps

* Explore the [Immersive Reader SDK on GitHub](https://github.com/microsoft/immersive-reader-sdk)
* [Quickstart: Create a web app that launches the Immersive Reader (C#)](./quickstarts/client-libraries.md?pivots=programming-language-csharp)
