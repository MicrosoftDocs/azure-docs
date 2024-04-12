---
title: Immersive Reader SDK Javascript reference
titleSuffix: Azure AI services
description: Learn about the Immersive Reader JavaScript library that allows you to integrate Immersive Reader into your application.
#services: cognitive-services
author: sharmas
manager: nitinme

ms.service: azure-ai-immersive-reader
ms.custom: devx-track-js
ms.topic: reference
ms.date: 02/28/2024
ms.author: sharmas
---

# Immersive Reader JavaScript SDK reference (v1.4)

The Immersive Reader SDK contains a JavaScript library that allows you to integrate the Immersive Reader into your application.

You can use `npm`, `yarn`, or an HTML `<script>` element to include the library of the latest stable build in your web application:

```html
<script type='text/javascript' src='https://ircdname.azureedge.net/immersivereadersdk/immersive-reader-sdk.1.4.0.js'></script>
```

```bash
npm install @microsoft/immersive-reader-sdk
```

```bash
yarn add @microsoft/immersive-reader-sdk
```

## Functions

The SDK exposes these functions:

- [ImmersiveReader.launchAsync(token, subdomain, content, options)](#function-launchasync)
- [ImmersiveReader.close()](#function-close)
- [ImmersiveReader.renderButtons(options)](#function-renderbuttons)

### Function: `launchAsync`

`ImmersiveReader.launchAsync(token, subdomain, content, options)` launches the Immersive Reader within an HTML `iframe` element in your web application. The size of your content is limited to a maximum of 50 MB.

```typescript
launchAsync(token: string, subdomain: string, content: Content, options?: Options): Promise<LaunchResponse>;
```

| Parameter | Type | Description |
| ---- | ---- |------------ |
| token | string | The Microsoft Entra authentication token. To learn more, see [How to create an Immersive Reader resource](how-to-create-immersive-reader.md). |
| subdomain | string | The custom subdomain of your [Immersive Reader resource](how-to-create-immersive-reader.md) in Azure. |
| content | [Content](#content) | An object that contains the content to be shown in the Immersive Reader. |
| options | [Options](#options) | Options for configuring certain behaviors of the Immersive Reader. Optional. |

#### Returns

Returns a `Promise<LaunchResponse>`, which resolves when the Immersive Reader is loaded. The `Promise` resolves to a [LaunchResponse](#launchresponse) object.

#### Exceptions

If the Immersive Reader fails to load, the returned `Promise` is rejected with an [Error](#error) object.

### Function: `close`

`ImmersiveReader.close()` closes the Immersive Reader.

An example use case for this function is if the exit button is hidden by setting `hideExitButton: true` in [options](#options). Then, a different button (for example, a mobile header's back arrow) can call this `close` function when it's clicked.

```typescript
close(): void;
```

### Function: `renderButtons`

The `ImmersiveReader.renderButtons(options)` function isn't necessary if you use the [How to customize the Immersive Reader button](how-to-customize-launch-button.md) guidance.

This function styles and updates the document's Immersive Reader button elements. If `options.elements` is provided, then the buttons are rendered within each element provided in `options.elements`. Using the `options.elements` parameter is useful when you have multiple sections in your document on which to launch the Immersive Reader, and want a simplified way to render multiple buttons with the same styling, or want to render the buttons with a simple and consistent design pattern. To use this function with the [renderButtons options](#renderbuttons-options) parameter, call `ImmersiveReader.renderButtons(options: RenderButtonsOptions);` on page load as demonstrated in the following code snippet. Otherwise, the buttons are rendered within the document's elements that have the class `immersive-reader-button` as shown in [How to customize the Immersive Reader button](how-to-customize-launch-button.md).

```typescript
// This snippet assumes there are two empty div elements in
// the page HTML, button1 and button2.
const btn1: HTMLDivElement = document.getElementById('button1');
const btn2: HTMLDivElement = document.getElementById('button2');
const btns: HTMLDivElement[] = [btn1, btn2];
ImmersiveReader.renderButtons({elements: btns});
```

See the [launch button](#launch-button) optional attributes for more rendering options. To use these options, add any of the option attributes to each `HTMLDivElement` in your page HTML.

```typescript
renderButtons(options?: RenderButtonsOptions): void;
```

| Parameter | Type | Description |
| ---- | ---- |------------ |
| options | [renderButtons options](#renderbuttons-options) | Options for configuring certain behaviors of the renderButtons function. Optional. |

#### renderButtons options

Options for rendering the Immersive Reader buttons.

```typescript
{
    elements: HTMLDivElement[];
}
```

| Parameter | Type | Description |
| ------- | ---- | ----------- |
| elements | HTMLDivElement[] | Elements to render the Immersive Reader buttons in. |

```Parameters
Type: HTMLDivElement[]
Required: false
```

## Launch button

The SDK provides default styling for the Immersive Reader launch button. Use the `immersive-reader-button` class attribute to enable this styling. For more information, see [How to customize the Immersive Reader button](how-to-customize-launch-button.md).

```html
<div class='immersive-reader-button'></div>
```

Use the following optional attributes to configure the look and feel of the button.

| Attribute | Description |
| --------- | ----------- |
| data-button-style | Sets the style of the button. Can be `icon`, `text`, or `iconAndText`. Defaults to `icon`. |
| data-locale | Sets the locale. For example, `en-US` or `fr-FR`. Defaults to English `en`. |
| data-icon-px-size | Sets the size of the icon in pixels. Defaults to 20 px. |

## LaunchResponse

Contains the response from the call to `ImmersiveReader.launchAsync`. A reference to the HTML `iframe` element that contains the Immersive Reader can be accessed via `container.firstChild`.

```typescript
{
    container: HTMLDivElement;
    sessionId: string;
    charactersProcessed: number;
}
```

| Parameter | Type | Description |
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

| Parameter | Type | Description |
| ------- | ---- | ----------- |
| code | String | One of a set of error codes. |
| message | String | Human-readable representation of the error. |

| Error code | Description |
| ---- | ----------- |
| BadArgument | Supplied argument is invalid. See `message` parameter of the error. |
| Timeout | The Immersive Reader failed to load within the specified timeout. |
| TokenExpired | The supplied token is expired. |
| Throttled | The call rate limit has been exceeded. |

## Types

### Content

Contains the content to be shown in the Immersive Reader.

```typescript
{
    title?: string;
    chunks: Chunk[];
}
```

| Parameter | Type | Description |
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

### Chunk

A single chunk of data, which is passed into the content of the Immersive Reader.

```typescript
{
    content: string;
    lang?: string;
    mimeType?: string;
}
```

| Parameter | Type | Description |
| ---- | ---- |------------ |
| content | String | The string that contains the content sent to the Immersive Reader. |
| lang | String | Language of the text, the value is in *IETF BCP 47-language* tag format, for example, en, es-ES. Language is detected automatically if not specified. For more information, see [Supported languages](#supported-languages). |
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

| MIME type | Description |
| --------- | ----------- |
| text/plain | Plain text. |
| text/html | [HTML content](#html-support). |
| application/mathml+xml | [Mathematical Markup Language (MathML)](how-to/display-math.md). |
| application/vnd.openxmlformats-officedocument.wordprocessingml.document | Microsoft Word .docx format document. |

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

| Parameter | Type | Description |
| ---- | ---- |------------ |
| uiLang | String | Language of the UI, the value is in *IETF BCP 47-language* tag format, for example, en, es-ES. Defaults to browser language if not specified. |
| timeout | Number | Duration (in milliseconds) before [launchAsync](#function-launchasync) fails with a timeout error (default is 15,000 ms). This timeout only applies to the initial launch of the Reader page, when the Reader page opens successfully and the spinner starts. Adjustment of the timeout shouldn't be necessary. |
| uiZIndex | Number | Z-index of the HTML `iframe` element that is created (default is 1000). |
| useWebview | Boolean| Use a webview tag instead of an HTML `iframe` element, for compatibility with Chrome Apps (default is false). |
| onExit | Function | Executes when the Immersive Reader exits. |
| customDomain | String | Reserved for internal use. Custom domain where the Immersive Reader webapp is hosted (default is null). |
| allowFullscreen | Boolean | The ability to toggle fullscreen (default is true). |
| parent | Node | Node in which the HTML `iframe` element or `Webview` container is placed. If the element doesn't exist, iframe is placed in `body`. |
| hideExitButton | Boolean | Hides the Immersive Reader's exit button arrow (default is false). This value should only be true if there's an alternative mechanism provided to exit the Immersive Reader (for example, a mobile toolbar's back arrow). |
| cookiePolicy | [CookiePolicy](#cookiepolicy-options) | Setting for the Immersive Reader's cookie usage (default is *CookiePolicy.Disable*). It's the responsibility of the host application to obtain any necessary user consent following EU Cookie Compliance Policy. For more information, see [Cookie Policy options](#cookiepolicy-options). |
| disableFirstRun | Boolean | Disable the first run experience. |
| readAloudOptions | [ReadAloudOptions](#readaloudoptions) | Options to configure Read Aloud. |
| translationOptions | [TranslationOptions](#translationoptions) | Options to configure translation. |
| displayOptions | [DisplayOptions](#displayoptions) | Options to configure text size, font, theme, and so on. |
| preferences | String | String returned from onPreferencesChanged representing the user's preferences in the Immersive Reader. For more information, see [How to store user preferences](how-to-store-user-preferences.md). |
| onPreferencesChanged | Function | Executes when the user's preferences have changed. For more information, see [How to store user preferences](how-to-store-user-preferences.md). |
| disableTranslation | Boolean | Disable the word and document translation experience. |
| disableGrammar | Boolean | Disable the Grammar experience. This option also disables Syllables, Parts of Speech, and Picture Dictionary, which depends on Parts of Speech. |
| disableLanguageDetection | Boolean | Disable Language Detection to ensure the Immersive Reader only uses the language that is explicitly specified on the [Content](#content)/[Chunk[]](#chunk). This option should be used sparingly, primarily in situations where language detection isn't working. For instance, this issue is more likely to happen with short passages of fewer than 100 characters. You should be certain about the language you're sending, as text-to-speech won't have the correct voice. Syllables, Parts of Speech, and Picture Dictionary don't work correctly if the language isn't correct. |

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
```Parameters
Type: String
Required: false
Default value: null
```

> [!CAUTION]
> Don't attempt to programmatically change the values of the `-preferences` string sent to and from the Immersive Reader application because this might cause unexpected behavior resulting in a degraded user experience. Host applications should never assign a custom value to or manipulate the `-preferences` string. When using the `-preferences` string option, use only the exact value that was returned from the `-onPreferencesChanged` callback option.

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

## ReadAloudOptions

```typescript
type ReadAloudOptions = {
    voice?: string;
    speed?: number;
    autoplay?: boolean;
};
```

| Parameter | Type | Description |
| ---- | ---- |------------ |
| voice | String | Voice, either *Female* or *Male*. Not all languages support both genders. |
| speed | Number | Playback speed. Must be between 0.5 and 2.5, inclusive. |
| autoPlay | Boolean | Automatically start Read Aloud when the Immersive Reader loads. |

> [!NOTE]
> Due to browser limitations, autoplay is not supported in Safari.

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

## TranslationOptions

```typescript
type TranslationOptions = {
    language: string;
    autoEnableDocumentTranslation?: boolean;
    autoEnableWordTranslation?: boolean;
};
```

| Parameter | Type | Description |
| ---- | ---- |------------ |
| language | String | Sets the translation language, the value is in *IETF BCP 47-language* tag format, for example, fr-FR, es-MX, zh-Hans-CN. Required to automatically enable word or document translation. |
| autoEnableDocumentTranslation | Boolean | Automatically translate the entire document. |
| autoEnableWordTranslation | Boolean | Automatically enable word translation. |

##### `language`
```Parameters
Type: String
Required: true
Default value: null 
Values available: For more information, see the Supported languages section
```

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

| Parameter | Type | Description |
| ---- | ---- |------------ |
| textSize | Number | Sets the chosen text size. |
| increaseSpacing | Boolean | Sets whether text spacing is toggled on or off. |
| fontFamily | String | Sets the chosen font (*Calibri*, *ComicSans*, or *Sitka*). |
| themeOption | ThemeOption | Sets the chosen theme of the reader (*Light*, *Dark*). |

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

## CookiePolicy options

```typescript
enum CookiePolicy { Disable, Enable }
```

**The following settings are for informational purposes only**. The Immersive Reader stores its settings, or user preferences, in cookies. This *cookiePolicy* option **disables** the use of cookies by default to follow EU Cookie Compliance laws. If you want to re-enable cookies and restore the default functionality for Immersive Reader user preferences, your website or application needs proper consent from the user to enable cookies. Then, to re-enable cookies in the Immersive Reader, you must explicitly set the *cookiePolicy* option to *CookiePolicy.Enable* when launching the Immersive Reader.

The following table describes what settings the Immersive Reader stores in its cookie when the *cookiePolicy* option is enabled.

| Setting | Type | Description |
| ------- | ---- | ----------- |
| textSize | Number | Sets the chosen text size. |
| fontFamily | String | Sets the chosen font (*Calibri*, *ComicSans*, or *Sitka*). |
| textSpacing | Number | Sets whether text spacing is toggled on or off. |
| formattingEnabled | Boolean | Sets whether HTML formatting is toggled on or off. |
| theme | String | Sets the chosen theme (*Light*, *Dark*). |
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

## Supported languages

The translation feature of Immersive Reader supports many languages. For more information, see [Language support](language-support.md).

## HTML support

When formatting is enabled, the following content is rendered as HTML in the Immersive Reader.

| HTML | Supported content |
| --------- | ----------- |
| Font styles | Bold, italic, underline, code, strikethrough, superscript, subscript |
| Unordered lists | Disc, circle, square |
| Ordered lists | Decimal, upper-Alpha, lower-Alpha, upper-Roman, lower-Roman |

Unsupported tags are rendered comparably. Images and tables are currently not supported.

## Browser support

Use the most recent versions of the following browsers for the best experience with the Immersive Reader.

* Microsoft Edge
* Google Chrome
* Mozilla Firefox
* Apple Safari

## Next step

> [!div class="nextstepaction"]
> [Explore the Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk)
