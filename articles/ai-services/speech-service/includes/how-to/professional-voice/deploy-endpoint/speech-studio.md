---
 title: include file
 description: include file
 author: eur
 ms.author: eric-urban
 ms.service: azure-ai-services
 ms.topic: include
 ms.date: 11/24/2023
 ms.custom: include
---

After you've successfully created and [trained](../../../../professional-voice-train-voice.md) your voice model, you deploy it to a custom neural voice endpoint. 

> [!NOTE]
> You can create up to 50 endpoints with a standard (S0) Speech resource, each with its own custom neural voice.

To use your custom neural voice, you must specify the voice model name, use the custom URI directly in an HTTP request, and use the same Speech resource to pass through the authentication of the text to speech service.

## Add a deployment endpoint

To create a custom neural voice endpoint:

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customvoice).
1. Select **Custom voice** > Your project name > **Deploy model** > **Deploy model**. 
1. Select a voice model that you want to associate with this endpoint.  
1. Enter a **Name** and **Description** for your custom endpoint.
1. Select **Endpoint type** according to your scenario. If your resource is in a supported region, the default setting for the endpoint type is *High performance*. Otherwise, if the resource is in an unsupported region, the only available option is *Fast resume*.
   - *High performance*: Optimized for scenarios with real-time and high-volume synthesis requests, such as conversational AI, call-center bots. It takes around 5 minutes to deploy or resume an endpoint. For information about regions where the *High performance* endpoint type is supported, see the footnotes in the [regions](../../../../regions.md#speech-service) table. 
   - *Fast resume*: Optimized for audio content creation scenarios with less frequent synthesis requests. Easy and quick to deploy or resume an endpoint in under a minute. The *Fast resume* endpoint type is supported in all [regions](../../../../regions.md#speech-service) where text to speech is available.
   
1. Select **Deploy** to create your endpoint.

After your endpoint is deployed, the endpoint name appears as a link. Select the link to display information specific to your endpoint, such as the endpoint key, endpoint URL, and sample code. When the status of the deployment is **Succeeded**, the endpoint is ready for use.

## Application settings

The application settings that you use as REST API request parameters are available on the **Deploy model** tab in [Speech Studio](https://aka.ms/custom-voice-portal).

:::image type="content" source="../../../../media/custom-voice/cnv-endpoint-app-settings-zoom.png" alt-text="Screenshot of custom endpoint app settings in Speech Studio." lightbox="../../../../media/custom-voice/cnv-endpoint-app-settings-full.png":::

* The **Endpoint key** shows the Speech resource key the endpoint is associated with. Use the endpoint key as the value of your `Ocp-Apim-Subscription-Key` request header. 
* The **Endpoint URL** shows your service region. Use the value that precedes `voice.speech.microsoft.com` as your service region request parameter. For example, use `eastus` if the endpoint URL is `https://eastus.voice.speech.microsoft.com/cognitiveservices/v1`.
* The **Endpoint URL** shows your endpoint ID. Use the value appended to the `?deploymentId=` query parameter as the value of your endpoint ID request parameter.

## Use your custom voice

The custom endpoint is functionally identical to the standard endpoint that's used for text to speech requests. 

One difference is that the `EndpointId` must be specified to use the custom voice via the Speech SDK. You can start with the [text to speech quickstart](../../../../get-started-text-to-speech.md) and then update the code with the `EndpointId` and `SpeechSynthesisVoiceName`. For more information, see [use a custom endpoint](../../../../how-to-speech-synthesis.md#use-a-custom-endpoint).

To use a custom voice via [Speech Synthesis Markup Language (SSML)](../../../../speech-synthesis-markup-voice.md#use-voice-elements), specify the model name as the voice name. This example uses the `YourCustomVoiceName` voice. 

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="YourCustomVoiceName">
        This is the text that is spoken. 
    </voice>
</speak>
```

## Switch to a new voice model in your product

Once you've updated your voice model to the latest engine version, or if you want to switch to a new voice in your product, you need to redeploy the new voice model to a new endpoint. Redeploying new voice model on your existing endpoint is not supported. After deployment, switch the traffic to the newly created endpoint. We recommend that you transfer the traffic to the new endpoint in a test environment first to ensure that the traffic works well, and then transfer to the new endpoint in the production environment. During the transition, you need to keep the old endpoint. If there are some problems with the new endpoint during transition, you can switch back to your old endpoint. If the traffic has been running well on the new endpoint for about 24 hours (recommended value), you can delete your old endpoint. 

> [!NOTE]
> If your voice name is changed and you are using Speech Synthesis Markup Language (SSML), be sure to use the new voice name in SSML.

## Suspend and resume an endpoint

You can suspend or resume an endpoint, to limit spend and conserve resources that aren't in use. You won't be charged while the endpoint is suspended. When you resume an endpoint, you can continue to use the same endpoint URL in your application to synthesize speech. 

> [!NOTE]
> The suspend operation will complete almost immediately. The resume operation completes in about the same amount of time as a new deployment. 

This section describes how to suspend or resume a custom neural voice endpoint in the Speech Studio portal.

### Suspend endpoint

1. To suspend and deactivate your endpoint, select **Suspend** from the **Deploy model** tab in [Speech Studio](https://aka.ms/custom-voice-portal).

   :::image type="content" source="../../../../media/custom-voice/cnv-endpoint-suspend.png" alt-text="Screenshot of the select suspend endpoint option":::

1. In the dialog box that appears, select **Submit**. After the endpoint is suspended, Speech Studio will show the **Successfully suspended endpoint** notification.

### Resume endpoint

1. To resume and activate your endpoint, select **Resume** from the **Deploy model** tab in [Speech Studio](https://aka.ms/custom-voice-portal).

   :::image type="content" source="../../../../media/custom-voice/cnv-endpoint-resume.png" alt-text="Screenshot of the select resume endpoint option":::

1. In the dialog box that appears, select **Submit**. After you successfully reactivate the endpoint, the status will change from **Suspended** to **Succeeded**.
