### Templates with no parameters

If the template takes no parameters, you don't need to supply the values or bindings when creating the `MessageTemplate`.

```csharp
var messageTemplate = new MessageTemplate(templateName, templateLanguage); 
``````

### Templates with text parameters in the body

Use `MessageTemplateText` to define parameters in the body denoted with double brackets surrounding a number, such as `{{1}}`. The number, indexed started at 1, indicates the order in which the binding values must be supplied to create the message template.

```
{
  "type": "BODY",
  "text": "Message with two parameters: {{1}} and {{2}}"
},
```

```csharp
var param1 = new MessageTemplateText(name: "first", text: "First Parameter");
var param2 = new MessageTemplateText(name: "second", text: "Second Parameter");
IEnumerable<MessageTemplateValue> values = new List<MessageTemplateValue>
{
    param1,
    param2
};
MessageTemplateWhatsAppBindings bindings = new MessageTemplateWhatsAppBindings(
    body: new[] { param1.Name, param2.Name });
var messageTemplate = new MessageTemplate(templateName, templateLanguage, values, bindings); 
``````

### Templates with media in the header

Use `MessageTemplateImage`, `MessageTemplateVideo`, or `MessageTemplateDocument` to define the media parameter in a header.

For example:
```
{
  "type": "HEADER",
  "format": "IMAGE"
},
```

However, the "format" can have different media types:
| Format   | MessageTemplateValue Type | File Type |
|----------|---------------------------|-----------|
| IMAGE    | MessageTemplateImage      | png, jpg  |
| VIDEO    | MessageTemplateVideo      | mp4       |
| DOCUMENT | MessageTemplateDocument   | pdf       |

For example, image media is sent like this:
```csharp
var url = new Uri("< Your media URL >");

var media = new MessageTemplateImage("image", url);
IEnumerable<MessageTemplateValue> values = new List<MessageTemplateValue>
{
    media
};
var bindings = new MessageTemplateWhatsAppBindings(
    header: new[] { media.Name });

var messageTemplate = new MessageTemplate(templateName, templateLanguage, values, bindings);
``````

### Templates with quick reply buttons

Use `MessageTemplateQuickActionValue` to define the payload for quick reply buttons.

```
{
  "type": "BUTTONS",
  "buttons": [
    {
      "type": "QUICK_REPLY",
      "text": "Yes"
    },
    {
      "type": "QUICK_REPLY",
      "text": "No"
    }
  ]
}
```

- `name`   
Match a button's `text` parameter in the template details.   
- `text`   
The `text` attribute isn't used.
- `payload`   
The `payload` assigned to a button is available in a message reply if the user selects the button.

```csharp
var yes = new MessageTemplateQuickActionValue(name: "Yes", payload: "User said yes");
var no = new MessageTemplateQuickActionValue(name: "No", payload: "User said no");

IEnumerable<MessageTemplateValue> values = new List<MessageTemplateValue>
{
    yes,
    no
};
var bindings = new MessageTemplateWhatsAppBindings(
    button: new Dictionary<string, MessageTemplateValueWhatsAppSubType>
    {
        { yes.Name, MessageTemplateValueWhatsAppSubType.QuickReply },
        { no.Name, MessageTemplateValueWhatsAppSubType.QuickReply }
    });

var messageTemplate = new MessageTemplate(templateName, templateLanguage, values, bindings);
``````

### Templates with call to action buttons

Use `MessageTemplateQuickActionValue` to define the url suffix for call to action buttons.

```
{
  "type": "BUTTONS",
  "buttons": [
    {
      "type": "URL",
      "text": "Take Survey",
      "url": "https://www.example.com/{{1}}"
    }
  ]
}
```

- `name`   
The `name` is `text`.
- `text`   
The `text` attribute defines the text that is appended to the URL.   
- `payload`   
The 'payload' attribute isn't required.

```csharp
var urlSuffix = new MessageTemplateQuickActionValue(name: "text", text: "url-suffix-text");

IEnumerable<MessageTemplateValue> values = new List<MessageTemplateValue>
{
    urlSuffix
};
var bindings = new MessageTemplateWhatsAppBindings(
    button: new Dictionary<string, MessageTemplateValueWhatsAppSubType>
    {
        { urlSuffix.Name, MessageTemplateValueWhatsAppSubType.Url }
    });

var messageTemplate = new MessageTemplate(templateName, templateLanguage, values, bindings);
``````