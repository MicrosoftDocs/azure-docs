---
title: Tutorial - Enable Inline Image Support
author: palatter
ms.author: palatter
ms.date: 10/25/2023
ms.topic: include
ms.service: azure-communication-services
---

In this tutorial, you learn how to enable inline image support using the Azure Communication Services Chat SDK for C#.

## Prerequisites 

* Go through the quickstart - [Join your chat app to a Teams meeting](../../../quickstarts/chat/meeting-interop.md). 
* Create an Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md). You need to **record your connection string** for this tutorial.
* Set up a Teams meeting using your business account and have the meeting URL ready.
* Use Chat SDK for C# (Azure.Communication.Chat) 1.3.0 or the latest. See [here](https://www.nuget.org/packages/Azure.Communication.Chat/).
  
## Goal

- Grab the previewUri for inline image attachments

## Handle inline images for new messages

In the [quickstart](../../../quickstarts/chat/meeting-interop.md), we poll for messages and append new messages to the messageList. We build on this functionality later to include parsing and fetching of the inline images.

```c#
  CommunicationUserIdentifier currentUser = new(user_Id_);
  AsyncPageable<ChatMessage> allMessages = chatThreadClient.GetMessagesAsync();
  SortedDictionary<long, string> messageList = [];
  int textMessages = 0;
  await foreach (ChatMessage message in allMessages)
  {
      if (message.Type == ChatMessageType.Html || message.Type == ChatMessageType.Text)
      {
          textMessages++;
          var userPrefix = message.Sender.Equals(currentUser) ? "[you]:" : "";
          var strippedMessage = StripHtml(message.Content.Message);
          messageList.Add(long.Parse(message.SequenceId), $"{userPrefix}{strippedMessage}");
      }
  }
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

As an example, the following JSON is an example of what `ChatAttachment` might look like for an image attachment:

```json
"attachments": [
    {
        "id": "9d89acb2-c4e4-4cab-b94a-7c12a61afe30",
        "attachmentType": "image",
        "name": "Screenshot.png",
        "url": "https://contoso.communication.azure.com/chat/threads/19:9d89acb29d89acb2@thread.v2/images/9d89acb2-c4e4-4cab-b94a-7c12a61afe30/views/original?api-version=2023-11-03",
        "previewUrl": "https://contoso.communication.azure.com/chat/threads/19:9d89acb29d89acb2@thread.v2/images/9d89acb2-c4e4-4cab-b94a-7c12a61afe30/views/small?api-version=2023-11-03"
      }
]
```

Now let's go back and replace the code to add extra logic to parse and fetch the image attachments.

```c#
  CommunicationUserIdentifier currentUser = new(user_Id_);
  AsyncPageable<ChatMessage> allMessages = chatThreadClient.GetMessagesAsync();
  SortedDictionary<long, string> messageList = [];
  int textMessages = 0;
  await foreach (ChatMessage message in allMessages)
  {
      // Get message attachments that are of type 'image'
      IEnumerable<ChatAttachment> imageAttachments = message.Content.Attachments.Where(x => x.AttachmentType == ChatAttachmentType.Image);

      // Fetch image and render
      var chatAttachmentImageUris = new List<Uri>();
      foreach (ChatAttachment imageAttachment in imageAttachments)
      {
          client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", communicationTokenCredential.GetToken().Token);
          var response = await client.GetAsync(imageAttachment.PreviewUri);
          var randomAccessStream = await response.Content.ReadAsStreamAsync();
          await Dispatcher.RunAsync(CoreDispatcherPriority.Normal, async () =>
          {
              var bitmapImage = new BitmapImage();
              await bitmapImage.SetSourceAsync(randomAccessStream.AsRandomAccessStream());
              InlineImage.Source = bitmapImage;
          });

          chatAttachmentImageUris.Add(imageAttachment.PreviewUri);
      }

      // Build message list
      if (message.Type == ChatMessageType.Html || message.Type == ChatMessageType.Text)
      {
          textMessages++;
          var userPrefix = message.Sender.Equals(currentUser) ? "[you]:" : "";
          var strippedMessage = StripHtml(message.Content.Message);
          var chatAttachments = chatAttachmentImageUris.Count > 0 ? "[Attachments]:\n" + string.Join(",\n", chatAttachmentImageUris) : "";
          messageList.Add(long.Parse(message.SequenceId), $"{userPrefix}{strippedMessage}\n{chatAttachments}");
      }
```

Noticing in this example, we grab all attachments from the message of type 'Image' and then we fetch each one of the images. We must use our 'Token' in the 'Bearer' portion of the request header for authorization purposes. Once the image is downloaded, we can assign it to the 'InlineImage' element of the view.

We also include a list of the attachment URIs to be shown along with the message in text message list.

## Demo

* Run the application from the IDE.
* Enter a Teams meeting link.
* Join meeting.
* Admit user on the Teams side.
* Send a message from the Teams side with an image.
* The url included with the message is displayed in the message list and the last received image rendered at the bottom of the window.

