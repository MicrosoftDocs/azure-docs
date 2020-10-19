---
title: Audio Content Creation - Speech service
titleSuffix: Azure Cognitive Services
description: Audio Content Creation is an online tool that allows you to customize and fine-tune Microsoft's text-to-speech output for your apps and products.
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 01/31/2020
ms.author: trbye
---

# Improve synthesis with the Audio Content Creation tool

[Audio Content Creation](https://aka.ms/audiocontentcreation) is an easy-to-use and powerful tool that lets you build highly natural audio content for a variety of scenarios, like audiobooks, news broadcasts, video narrations, and chat bots. With Audio Content Creation, you can fine-tune text-to-speech voices and design customized audio experiences in an efficient and low-cost way.

The tool is based on [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md). It allows you to adjust text-to-speech output attributes in real time or batch synthesis, such as voice characters, voice styles, speaking speed, pronunciation, and prosody.

You can have easy access to more than 150 pre-built voices across close to 50 different languages, including the state-of-the-art neural TTS voices, and your custom voice if you have built one. 

See the [video tutorial](https://www.youtube.com/watch?v=O1wIJ7mts_w) for Audio Content Creation.

## How to Get Started?

Audio Content Creation is a free tool, but you will pay for the Azure Speech service you consume. To work with the tool, you need to log in with an Azure account and create a speech resource. For each Azure account, you have monthly free speech quotas which include 500K characters for Neural TTS voices (per month), 5 million characters for standard and custom voices (per month), and 1 custom voice endpoint hosting service (per month). The monthly allotted amount is usually enough for a small content team of around 3-5 people. Here are the steps for how to create an Azure account and get a speech resource. 

### Step 1 - Create an Azure account

To work with Audio Content Creation, you need to have a [Microsoft account](https://account.microsoft.com/account) and an [Azure account](https://azure.microsoft.com/free/ai/). Follow these instructions to [set up the account](get-started.md#new-resource). 

[Azure portal](https://portal.azure.com/) is the centralized place for you to manage your Azure account. You can create the speech resource, manage the product access, and monitor everything from simple web apps to complex cloud deployments. 

### Step 2 - Create a Speech resource

After signing up for the Azure account, you need to create a Speech resource under your Azure account to access Speech services. View the instructions for [how to create a Speech resource](https://docs.microsoft.com/azure/cognitive-services/speech-service/overview#create-the-azure-resource). 

It takes a few moments to deploy your new Speech resource. Once the deployment is complete, you can start the Audio Content Creation journey. 

 >[!NOTE]
   > If you plan to use Neural voices, make sure that you create your resource in one of the following regions: Australia East, Canada Central, East US, India Central, South Central US, Southeast Asia, UK South, West Europe, and West US 2.
 
### Step 3 - Log into the ACC studio with your Azure account and Speech resource

1. After getting the Azure account and the Speech resource, you can log into [Audio Content Creation](https://aka.ms/audiocontentcreation).
2. Select the Speech resource you want to work on. Click **Go to Studio**. You can also create a new Speech resource here.
3. You can modify your Speech resource at any time with the **Settings** option, located in the top nav.

## How to use the tool?

This diagram shows the steps it takes to fine-tune text-to-speech outputs. Use the links below to learn more about each step.

![A diagram of the steps it takes to fine-tune text-to-speech outputs.](media/audio-content-creation/audio-content-creation-diagram.jpg)

1. Choose the speech resource you want to work on.
2. [Create an audio tuning file](#create-an-audio-tuning-file) using plain text or SSML scripts. Type or upload your content in to Audio Content Creation.
3. Choose the voice and the language for your script content. Audio Content Creation includes all of the [Microsoft text-to-speech voices](language-support.md#text-to-speech). You can use standard, neural, or your own custom voice.
   >[!NOTE]
   > Gated access is available for Custom Neural Voices, which allow you to create high-definition voices similar to natural-sounding speech. For additional details, see [Gating process](https://aka.ms/ignite2019/speech/ethics).

4. Preview the default synthesis output by click **play**. Then improve the output by adjusting pronunciation, break, pitch, rate, intonation, voice style, and more. For a complete list of options, see [Speech Synthesis Markup Language](speech-synthesis-markup.md). Here is a [video](https://www.youtube.com/watch?v=O1wIJ7mts_w) to show how to fine-tune speech output with Audio Content Creation. 
5. Save and [export your tuned audio](#export-tuned-audio). When you save the tuning track in the system, you can continue to work and iterate on the output. When you're satisfied with the output, you can create an audio creation task with the export feature. You can observe the status of the export task and download the output for use with your apps and products.

## Create an audio tuning file

There are two ways to get your content into the Audio Content Creation tool.

**Option 1:**

1. Click **New file** to create a new audio tuning file.
2. Type or paste your content into the editing window. The characters for each file is up to 20,000. If your script is longer than 20,000 characters, you can use Option 2 to automatically split your content into multiple files. 
3. Don't forget to save.

**Option 2:**

1. Click **Upload** to import one or more text files. Both plain text and SSML are supported.
2. If your script file is more than 20,000 characters, please split the file by paragraphs, by character or by regular expressions. 
3. When you upload your text files, make sure that the file meets these requirements.

   | Property | Value / Notes |
   |----------|---------------|
   | File format | Plain text (.txt)<br/> SSML text (.txt)<br/> Zip files aren't supported |
   | Encoding format | UTF-8 |
   | File name | Each file must have a unique name. Duplicates aren't supported. |
   | Text length | Text files must not exceed 20,000 characters. |
   | SSML restrictions | Each SSML file can only contain a single piece of SSML. |

**Plain text example**

```txt
Welcome to use Audio Content Creation to customize audio output for your products.
```
**SSML text example**

```xml
<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" version="1.0" xml:lang="en-US">
    <voice name="Microsoft Server Speech Text to Speech Voice (en-US, AriaNeural)">
    Welcome to use Audio Content Creation <break time="10ms" />to customize audio output for your products.
    </voice>
</speak>
```

## Export tuned audio

After you've reviewed your audio output and are satisfied with your tuning and adjustment, you can export the audio.

1. Click **Export** to create an audio creation task. **Export to Audio Library** is recommended as it supports the long audio output and the full audio output experience. You can also download the audio to your local disk directly, but only the first 10 minutes are available. 
2. Choose the output format for your tuned audio. A list of supported formats and sample rates is available below.
3. You can view the status of the task on the **Export task** tab. If the task fails, see the detailed information page for a full report.
4. When the task is complete, your audio is available for download on the **Audio Library** tab.
5. Click **Download**. Now you're ready to use your custom tuned audio in your apps or products.

**Supported audio formats**

| Format | 16 kHz sample rate | 24 kHz sample rate |
|--------|--------------------|--------------------|
| wav | riff-16khz-16bit-mono-pcm | riff-24khz-16bit-mono-pcm |
| mp3 | audio-16khz-128kbitrate-mono-mp3 | audio-24khz-160kbitrate-mono-mp3 |

## How to add/remove Audio Content Creation users?

If more than 1 user want to use Audio Content Creation. You can either share your Azure account and password to the user, or grant user the access to the Azure subscription and the speech resource. If you add a user to an Azure subscription, the user can access all the resources under the Azure subscription. But if you only add a user to a speech resource, the user will only have access to the speech resource. He can't have access to the other resources under this Azure subscription. To use Audio Content Creation, you can only give users the access of speech resource. 

### Add users to a speech resource
1. Search for **Cognitive services** in the Azure portal, select the speech resource that you want to add users to.
2. Click **Access control (IAM)**. Click the **Role assignments** tab to view all the role assignments for this subscription.
3. Click **Add** > **Add role assignment** to open the Add role assignment pane. In the Role drop-down list, select the **Cognitive Service User** role. If you want to give the user ownership of this speech resource, you can select the role as Owner.
4. In the Select list, select a user. If you do not see the user in the list, you can type in the Select box to search the directory for display names and email addresses. If the user is not in this directory, you can input the user’s [Microsoft account](https://account.microsoft.com/account) (which is trusted by Azure active directory). 
5. Click **Save** to assign the role. After a few moments, the user is assigned the Cognitive Service User role at the speech resource scope.
6. The users you added will receive an invitation email, click **Accept invitation** > **Accept to join Azure**, then they would be able to use [Audio Content Creation](https://aka.ms/audiocontentcreation).
   
Users who are in the same speech resource will see each other’s work in ACC studio. If you want each individual user to have a unique and private workplace in Audio Content Creation, please [create a new speech resource](#step-2---create-a-speech-resource) for each user and give each user the unique access to the speech resource. 

### Remove users from a speech resource
1. Search for **Cognitive services** in the Azure portal, select the speech resource that you want to remove users from.
2. Click **Access control (IAM)**. Click the **Role assignments** tab to view all the role assignments for this speech resource.
3. Select the users you want to remove, click **Remove** > **Yes**.

### Enable users to grant access
If you want one of the users to give access to other users, you need to give the user the owner role for the speech resource and set the user as the Azure directory reader. 
1. Add the user as the owner of the speech resource. See [how to add users to a speech resource](#add-users-to-a-speech-resource).
    ![add-role](media/add-role.png "Add role assignment field")
1. Select the collapsed menu in the upper left. Click **Azure Active Directory**, and then Click **Users**.
1. Search the user's Microsoft account, and go to the user's detail page. Click **Assigned roles**.
1. Click **Add assignments** -> **Directory Readers**.

## See also

* [Long Audio API](https://aka.ms/long-audio-api)

## Next steps

> [!div class="nextstepaction"]
> [Speech Studio](https://speech.microsoft.com)
