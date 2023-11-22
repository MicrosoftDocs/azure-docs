---
title: Tutorial - Enable Inline Image Support
author: palatter
ms.author: palatter
ms.date: oct 25, 2023
ms.topic: include
ms.service: azure-communication-services
---

In this tutorial, you learn how to enable inline image support using the Azure Communication Services Chat SDK for C#.

## Sample Code
Find the finalized code of this tutorial on [GitHub TODO](<TODO>).

## Prerequisites 

* You've gone through the quickstart - [Join your chat app to a Teams meeting](../../../quickstarts/chat/meeting-interop.md). 
* Create an Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md). You need to **record your connection string** for this tutorial.
* You've set up a Teams meeting using your business account and have the meeting URL ready.
* You're using the Chat SDK for C# (Azure.Communication.Chat) 1.3.0 or the latest. See [here](https://www.nuget.org/packages/Azure.Communication.Chat/).
  
## Goal

1. Grab the previewUri for inline image attachments
2. Grab the fullSize Uri for inline omage attachments

## Handle inline images for new messages

In the [quickstart](../../../quickstarts/chat/meeting-interop.md), we've created an event handler for `chatMessageReceived` event, which would be trigger when we receive a new message from the Teams user. We have also appended incoming message content to `messageContainer` directly upon receiving the `chatMessageReceived` event from the `chatClient` like this:

```js
<TODO>
```
From incoming event of type `ChatMessageReceivedEvent`, there's a property named `attachments`, which contains information about inline image, and it's all we need to render inline images in our UI:

```c#
public class ChatAttachment
{
    public ChatAttachment(string id, ChatAttachmentType attachmentType)
    public ChatAttachmentType AttachmentType { get }
    public string Id { get }
    public string Name { get }
    public System.Uri PreviewUrl { get }
    public System.Uri Url { get }
}

public struct ChatAttachmentType : System.IEquatable<AttachmentType>
{
    public ChatAttachmentType(string value)
    public static File { get }
    public static Image { get }
}
```

As an example, the following JSON is an example of what `ChatAttachment` might look like for an image attachment and a file attachment:

```json
"attachments": [
    {
        "id": "08a182fe-0b29-443e-8d7f-8896bc1908a2",
        "attachmentType": "file",
        "name": "business report.pdf",
        "url": "",
        "previewUrl": "https://contoso.sharepoint.com/:u:/g/user/h8jTwB0Zl1AY"
    },
    {
        "id": "9d89acb2-c4e4-4cab-b94a-7c12a61afe30",
        "attachmentType": "image",
        "name": "Screenshot.png",
        "url": "https://contoso.communication.azure.com/chat/threads/19:9d89acb29d89acb2@thread.v2/images/9d89acb2-c4e4-4cab-b94a-7c12a61afe30/views/original?api-version=2023-11-03",
        "previewUrl": "https://contoso.communication.azure.com/chat/threads/19:9d89acb29d89acb2@thread.v2/images/9d89acb2-c4e4-4cab-b94a-7c12a61afe30/views/small?api-version=2023-11-03"
      }
]
``

Now let's go back to the replace the code to add some extra logic like the following code snippets: 

```c#
    CommunicationUserIdentifier currentUser = new(user_Id_);
    AsyncPageable<ChatMessage> allMessages = chatThreadClient.GetMessagesAsync();
    SortedDictionary<long, string> messageList = [];
    int textMessages = 0;
    await foreach (ChatMessage message in allMessages)
    {
        // Get message attachments that are of type 'image'
        IEnumerable<ChatAttachment> imageAttachments = message.Content.Attachments.Where(x => x.AttachmentType == ChatAttachmentType.Image);

        var chatAttachmentImageUris = new List<Uri>();
        foreach (ChatAttachment imageAttachment in imageAttachments)
        {
            chatAttachmentImageUris.Add(imageAttachment.PreviewUri);
        }

        if (message.Type == ChatMessageType.Html || message.Type == ChatMessageType.Text)
        {
            textMessages++;
            var userPrefix = message.Sender.Equals(currentUser) ? "[you]:" : "";
            var strippedMessage = StripHtml(message.Content.Message);
            var chatAttachments = chatAttachmentImageUris.Count > 0 ? "[Attachments]:\n" + string.Join(",\n", chatAttachmentImageUris) : "";
            messageList.Add(long.Parse(message.SequenceId), $"{userPrefix}{strippedMessage}\n{chatAttachments}");
        }
    }
```

Noticing in this example, we've created two helper functions - `fetchPreviewImages` and `setImgHandler` - where the first one fetches preview image directly from the `previewURL` provided in each `ChatAttachment` object with an auth header. Similarly, we set up a `onclick` event for each image in the function `setImgHandler`, and in the event handler, we fetch a full scale image from property `url` from the `ChatAttachment` object with an auth header.

Now we've concluded all the changes we need to render inline images for messages coming from real time notifications.

## Run the code 

Webpack users can use the `webpack-dev-server` to build and run your app. Run the following command to bundle your application host on a local webserver:

```console
<TODO>
```

## Demo
Open your browser and navigate to `<TODO>`. Enter the meeting URL and the thread ID. Send some inline images from Teams client like this:

:::image type="content" source="<TODO>" alt-text="A screenshot of Teams client shown a sent message reads: Here are some ideas, let me know what you think! The message also contains two inline images of room interior mockups.":::

Then you should see the new message being rendered along with preview images:

:::image type="content" source="<TODO>" alt-text="A screenshot of sample app shown an incoming message with inline images being presented.":::

Upon clicking the preview image by the ACS user, an overlay would be shown with the full scale image sent by the Teams user:

 :::image type="content" source="<TODO>" alt-text="A screenshot of sample app shown an overlay of a full scale image being presented.":::
