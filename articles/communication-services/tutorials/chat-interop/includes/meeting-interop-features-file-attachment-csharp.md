---
title: Tutorial - Enable File Attachment Support
author: jpeng-ms
ms.author: jopeng
ms.date: 04/10/2024
ms.topic: include
ms.service: azure-communication-services
---

In this tutorial, you learn how to enable file attachment support using the Azure Communication Services Chat SDK for JavaScript.

## Sample code
Find the finalized code of this tutorial on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/join-chat-to-teams-meeting).

## Prerequisites 

* You've gone through the quickstart - [Join your chat app to a Teams meeting](../../../quickstarts/chat/meeting-interop.md). 
* Create an Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md). You need to **record your connection string** for this tutorial.
* You've set up a Teams meeting using your business account and have the meeting URL ready.
* You're using the Chat SDK for JavaScript (@azure/communication-chat) 1.5.0-beta.1 or the latest. See [here](https://www.npmjs.com/package/@azure/communication-chat).

## Goal

1. Be able to render file attachment in the message thread. Each file attachment card has an "Open" button.
2. Be able to render image attachments as inline images.

## Handle file attachments

The Chat SDK for C# returns a `ChatAttachmentType` of `file` for regular file attachments and `image` for inline images.

```csharp
public readonly partial struct ChatAttachmentType : IEquatable<ChatAttachmentType>
{
        private const string ImageValue = "image";
        private const string FileValue = "file";
        /// <summary> image. </summary>
        public static ChatAttachmentType Image { get; } = new ChatAttachmentType(ImageValue);
        /// <summary> file. </summary>
        public static ChatAttachmentType File { get; } = new ChatAttachmentType(FileValue);
}


```

As an example, the following JSON is an example of what `ChatAttachment` might look like for an image attachment and a file attachment when receiving requests from the server side:

```json
"attachments": [
    {
        "id": "08a182fe-0b29-443e-8d7f-8896bc1908a2",
        "attachmentType": "file",
        "name": "business report.pdf",
        "previewUrl": "https://contoso.sharepoint.com/:u:/g/user/h8jTwB0Zl1AY"
    },
    {
        "id": "9d89acb2-c4e4-4cab-b94a-7c12a61afe30",
        "attachmentType": "image", 
        "name": "Screenshot.png",
        "url": "https://contoso.communication.azure.com/chat/threads/19:9d89acb29d89acb2@thread.v2/messages/123/images/9d89acb2-c4e4-4cab-b94a-7c12a61afe30/views/original?api-version=2023-11-15-preview",
        "previewUrl": "https://contoso.communication.azure.com/chat/threads/19:9d89acb29d89acb2@thread.v2/messages/123/images/9d89acb2-c4e4-4cab-b94a-7c12a61afe30/views/small?api-version=2023-11-15-preview"
      }
]
```

Now let's go back to event handler we have created in previous [quickstart](../../../quickstarts/chat/meeting-interop.md) to add some extra logic to handle attachments with `attachmentType` of `file`: 

```csharp

await foreach (ChatMessage message in allMessages)
{
    // Get message attachments that are of type 'file'
    IEnumerable<ChatAttachment> fileAttachments = message.Content.Attachments.Where(x => x.AttachmentType == ChatAttachmentType.File);
    var chatAttachmentFileUris = new List<Uri>();
    foreach (var file in fileAttachments) 
    {
        chatAttachmentFileUris.Add(file.PreviewUri);
    }

    // Build message list
    if (message.Type == ChatMessageType.Html || message.Type == ChatMessageType.Text)
    {
        textMessages++;
        var userPrefix = message.Sender.Equals(currentUser) ? "[you]:" : "";
        var strippedMessage = StripHtml(message.Content.Message);
      


        var chatAttachments = fileAttachments.Count() > 0 ? "[Attachments]:\n" + string.Join(",\n", chatAttachmentFileUris) : "";
        messageList.Add(long.Parse(message.SequenceId), $"{userPrefix}{strippedMessage}\n{chatAttachments}");
    }
}

```

Specifically, for each file attachments, we get the `previewUrl` and construct a list of URLs in the `for loop`. Then we embed the string along with the chat message content.

That's all we need to do to handle file attachments.


## Handle image attachments

Image attachments need to be treated differently to standard `file` attachments. Image attachment have the `attachmentType` of `image`, which requires the communication token to retrieve either the preview or full-size images.

Before we go any further, make sure you have gone through the tutorial that demonstrates [how you can enable inline image support in your chat app](../meeting-interop-features-inline-image.md). To summary, fetching images require a communication token in the request header. Upon getting the image blob, we need to create an `ObjectUrl` that points to this blob. Then we inject this URL to `src` attribute of each inline image.

Now you're familiar with how inline images work and it's easy to render image attachments just like a regular inline image. 

```

```


That's it! Now we have added image attachment support as well.

