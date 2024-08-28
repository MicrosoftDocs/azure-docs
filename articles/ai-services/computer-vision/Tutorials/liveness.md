---
title: Detect liveness in faces
description: In this Tutorial, you learn how to Detect liveness in faces, using both server-side code and a client-side mobile application.
author: PatrickFarley
ms.author: pafarley
ms.service: azure-ai-vision
ms.custom:
  - ignite-2023
ms.topic: tutorial
ms.date: 11/06/2023
---

# Tutorial: Detect liveness in faces

Face Liveness detection can be used to determine if a face in an input video stream is real (live) or fake (spoofed). It's an important building block in a biometric authentication system to prevent imposters from gaining access to the system using a photograph, video, mask, or other means to impersonate another person.

The goal of liveness detection is to ensure that the system is interacting with a physically present live person at the time of authentication. Such systems are increasingly important with the rise of digital finance, remote access control, and online identity verification processes.

The Azure AI Face liveness detection solution successfully defends against various spoof types ranging from paper printouts, 2d/3d masks, and spoof presentations on phones and laptops. Liveness detection is an active area of research, with continuous improvements being made to counteract increasingly sophisticated spoofing attacks over time. Continuous improvements will be rolled out to the client and the service components over time as the overall solution gets more robust to new types of attacks.

[!INCLUDE [liveness-sdk-gate](../includes/liveness-sdk-gate.md)]



## Introduction

The liveness solution integration involves two distinct components: a frontend mobile/web application and an app server/orchestrator.

:::image type="content" source="../media/liveness/liveness-diagram.jpg" alt-text="Diagram of the liveness workflow in Azure AI Face." lightbox="../media/liveness/liveness-diagram.jpg":::

- **Frontend application**: The frontend application receives authorization from the app server to initiate liveness detection. Its primary objective is to activate the camera and guide end-users accurately through the liveness detection process.
- **App server**: The app server serves as a backend server to create liveness detection sessions and obtain an authorization token from the Face service for a particular session. This token authorizes the frontend application to perform liveness detection. The app server's objectives are to manage the sessions, to grant authorization for frontend application, and to view the results of the liveness detection process.

Additionally, we combine face verification with liveness detection to verify whether the person is the specific person you designated. The following table help describe details of the liveness detection features:

| Feature | Description |
| -- |--|
| Liveness detection | Determine an input is real or fake, and only the app server has the authority to start the liveness check and query the result. |
| Liveness detection with face verification | Determine an input is real or fake and verify the identity of the person based on a reference image you provided. Either the app server or the frontend application can provide a reference image. Only the app server has the authority to initial the liveness check and query the result. |

This tutorial demonstrates how to operate a frontend application and an app server to perform [liveness detection](#perform-liveness-detection) and [liveness detection with face verification](#perform-liveness-detection-with-face-verification) across various language SDKs.


## Prerequisites

- Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
- Your Azure account must have a **Cognitive Services Contributor** role assigned in order for you to agree to the responsible AI terms and create a resource. To get this role assigned to your account, follow the steps in the [Assign roles](/azure/role-based-access-control/role-assignments-steps) documentation, or contact your administrator. 
- Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFace"  title="Create a Face resource"  target="_blank">create a Face resource</a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**. 
    - You need the key and endpoint from the resource you create to connect your application to the Face service.
    - You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
- Access to the Azure AI Vision Face Client SDK for mobile (IOS and Android) and web. To get started, you need to apply for the [Face Recognition Limited Access features](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUQjA5SkYzNDM4TkcwQzNEOE1NVEdKUUlRRCQlQCN0PWcu) to get access to the SDK. For more information, see the [Face Limited Access](/legal/cognitive-services/computer-vision/limited-access-identity?context=%2Fazure%2Fcognitive-services%2Fcomputer-vision%2Fcontext%2Fcontext) page.

## Set up frontend applications and app servers to perform liveness detection

We provide SDKs in different languages for frontend applications and app servers. See the following instructions to set up your frontend applications and app servers.

### Download SDK for frontend application

Once you have access to the SDK, follow instructions in the [azure-ai-vision-sdk](https://github.com/Azure-Samples/azure-ai-vision-sdk) GitHub repository to integrate the UI and the code into your native mobile application. The liveness SDK supports Java/Kotlin for Android mobile applications, Swift for iOS mobile applications and JavaScript for web applications:
- For Swift iOS, follow the instructions in the [iOS sample](https://aka.ms/azure-ai-vision-face-liveness-client-sdk-ios-readme) 
- For Kotlin/Java Android, follow the instructions in the [Android sample](https://aka.ms/liveness-sample-java) 
- For JavaScript Web, follow the instructions in the [Web sample](https://aka.ms/liveness-sample-web) 

Once you've added the code into your application, the SDK handles starting the camera, guiding the end-user in adjusting their position, composing the liveness payload, and calling the Azure AI Face cloud service to process the liveness payload.

### Download Azure AI Face client library for app server

The app server/orchestrator is responsible for controlling the lifecycle of a liveness session. The app server has to create a session before performing liveness detection, and then it can query the result and delete the session when the liveness check is finished. We offer a library in various languages for easily implementing your app server. Follow these steps to install the package you want:
- For C#, follow the instructions in the [dotnet readme](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/face/Azure.AI.Vision.Face/README.md)
- For Java, follow the instructions in the [Java readme](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/face/azure-ai-vision-face/README.md)
- For Python, follow the instructions in the [Python readme](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/face/azure-ai-vision-face/README.md)
- For JavaScript, follow the instructions in the [JavaScript readme](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/face/ai-vision-face-rest/README.md)

#### Create environment variables

[!INCLUDE [create environment variables](../includes/face-environment-variables.md)]

## Perform liveness detection

The high-level steps involved in liveness orchestration are illustrated below:  

:::image type="content" source="../media/liveness/liveness-diagram.jpg" alt-text="Diagram of the liveness workflow in Azure AI Face." lightbox="../media/liveness/liveness-diagram.jpg":::

1. The frontend application starts the liveness check and notifies the app server. 

1. The app server creates a new liveness session with Azure AI Face Service. The service creates a liveness-session and responds back with a session-authorization-token. More information regarding each request parameter involved in creating a liveness session is referenced in [Liveness Create Session Operation](https://aka.ms/face-api-reference-createlivenesssession).

    #### [C#](#tab/csharp)
    ```csharp
    var endpoint = new Uri(System.Environment.GetEnvironmentVariable("FACE_ENDPOINT"));
    var credential = new AzureKeyCredential(System.Environment.GetEnvironmentVariable("FACE_APIKEY"));

    var sessionClient = new FaceSessionClient(endpoint, credential);

    var createContent = new CreateLivenessSessionContent(LivenessOperationMode.Passive)
    {
        DeviceCorrelationId = "723d6d03-ef33-40a8-9682-23a1feb7bccd",
        SendResultsToClient = false,
    };

    var createResponse = await sessionClient.CreateLivenessSessionAsync(createContent);
    var sessionId = createResponse.Value.SessionId;
    Console.WriteLine($"Session created.");
    Console.WriteLine($"Session id: {sessionId}");
    Console.WriteLine($"Auth token: {createResponse.Value.AuthToken}");
    ```

    #### [Java](#tab/java)
    ```java
    String endpoint = System.getenv("FACE_ENDPOINT");
    String accountKey = System.getenv("FACE_APIKEY");

    FaceSessionClient sessionClient = new FaceSessionClientBuilder()
        .endpoint(endpoint)
        .credential(new AzureKeyCredential(accountKey))
        .buildClient();

    CreateLivenessSessionContent parameters = new CreateLivenessSessionContent(LivenessOperationMode.PASSIVE)
        .setDeviceCorrelationId("723d6d03-ef33-40a8-9682-23a1feb7bccd")
        .setSendResultsToClient(false);

    CreateLivenessSessionResult creationResult = sessionClient.createLivenessSession(parameters);
    System.out.println("Session created.");
    System.out.println("Session id: " + creationResult.getSessionId());
    System.out.println("Auth token: " + creationResult.getAuthToken());
    ```

    #### [Python](#tab/python)
    ```python
    endpoint = os.environ["FACE_ENDPOINT"]
    key = os.environ["FACE_APIKEY"]

    face_session_client = FaceSessionClient(endpoint=endpoint, credential=AzureKeyCredential(key))

    created_session = await face_session_client.create_liveness_session(
        CreateLivenessSessionContent(
            liveness_operation_mode=LivenessOperationMode.PASSIVE,
            device_correlation_id="723d6d03-ef33-40a8-9682-23a1feb7bccd",
            send_results_to_client=False,
        )
    )
    print("Session created.")
    print(f"Session id: {created_session.session_id}")
    print(f"Auth token: {created_session.auth_token}")
    ```

    #### [JavaScript](#tab/javascript)
    ```javascript
    const endpoint = process.env['FACE_ENDPOINT'];
    const apikey = process.env['FACE_APIKEY'];

    const credential = new AzureKeyCredential(apikey);
    const client = createFaceClient(endpoint, credential);

    const createLivenessSessionResponse = await client.path('/detectLiveness/singleModal/sessions').post({
        body: {
            livenessOperationMode: 'Passive',
            deviceCorrelationId: '723d6d03-ef33-40a8-9682-23a1feb7bccd',
            sendResultsToClient: false,
        },
    });

    if (isUnexpected(createLivenessSessionResponse)) {
        throw new Error(createLivenessSessionResponse.body.error.message);
    }

    console.log('Session created.');
    console.log(`Session ID: ${createLivenessSessionResponse.body.sessionId}`);
    console.log(`Auth token: ${createLivenessSessionResponse.body.authToken}`);
    ```

    #### [REST API (Windows)](#tab/cmd)
    ```console
    curl --request POST --location "%FACE_ENDPOINT%/face/v1.1-preview.1/detectliveness/singlemodal/sessions" ^
    --header "Ocp-Apim-Subscription-Key: %FACE_APIKEY%" ^
    --header "Content-Type: application/json" ^
    --data ^
    "{ ^
        ""livenessOperationMode"": ""passive"", ^
        ""deviceCorrelationId"": ""723d6d03-ef33-40a8-9682-23a1feb7bccd"", ^
        ""sendResultsToClient"": ""false"" ^
    }"
    ```

    #### [REST API (Linux)](#tab/bash)
    ```bash
    curl --request POST --location "${FACE_ENDPOINT}/face/v1.1-preview.1/detectliveness/singlemodal/sessions" \
    --header "Ocp-Apim-Subscription-Key: ${FACE_APIKEY}" \
    --header "Content-Type: application/json" \
    --data \
    '{
        "livenessOperationMode": "passive",
        "deviceCorrelationId": "723d6d03-ef33-40a8-9682-23a1feb7bccd",
        "sendResultsToClient": "false"
    }'
    ```

    ---

    An example of the response body:
    ```json 
    {
        "sessionId": "a6e7193e-b638-42e9-903f-eaf60d2b40a5",
        "authToken": "<session-authorization-token>"
    }
    ```

1. The app server provides the session-authorization-token back to the frontend application. 

1. The frontend application provides the session-authorization-token during the Azure AI Vision SDK’s initialization. 

    #### [Android](#tab/mobile-kotlin)
    ```kotlin
    mServiceOptions?.setTokenCredential(com.azure.android.core.credential.TokenCredential { _, callback ->
        callback.onSuccess(com.azure.android.core.credential.AccessToken("<INSERT_TOKEN_HERE>", org.threeten.bp.OffsetDateTime.MAX))
    })
    ```

    #### [iOS](#tab/mobile-swift)
    ```swift
    serviceOptions?.authorizationToken = "<INSERT_TOKEN_HERE>"
    ```

    #### [Web](#tab/web-javascript)
    ```javascript
    azureAIVisionFaceAnalyzer.token = "<INSERT_TOKEN_HERE>"
    ```

    ---

1. The SDK then starts the camera, guides the user to position correctly, and then prepares the payload to call the liveness detection service endpoint. 
 
1. The SDK calls the Azure AI Vision Face service to perform the liveness detection. Once the service responds, the SDK notifies the frontend application that the liveness check has been completed.

1. The frontend application relays the liveness check completion to the app server. 

1. The app server can now query for the liveness detection result from the Azure AI Vision Face service. 

    #### [C#](#tab/csharp)
    ```csharp
    var getResultResponse = await sessionClient.GetLivenessSessionResultAsync(sessionId);

    var sessionResult = getResultResponse.Value;
    Console.WriteLine($"Session id: {sessionResult.Id}");
    Console.WriteLine($"Session status: {sessionResult.Status}");
    Console.WriteLine($"Liveness detection request id: {sessionResult.Result?.RequestId}");
    Console.WriteLine($"Liveness detection received datetime: {sessionResult.Result?.ReceivedDateTime}");
    Console.WriteLine($"Liveness detection decision: {sessionResult.Result?.Response.Body.LivenessDecision}");
    Console.WriteLine($"Session created datetime: {sessionResult.CreatedDateTime}");
    Console.WriteLine($"Auth token TTL (seconds): {sessionResult.AuthTokenTimeToLiveInSeconds}");
    Console.WriteLine($"Session expired: {sessionResult.SessionExpired}");
    Console.WriteLine($"Device correlation id: {sessionResult.DeviceCorrelationId}");
    ```

    #### [Java](#tab/java)
    ```java
    LivenessSession sessionResult = sessionClient.getLivenessSessionResult(creationResult.getSessionId());
    System.out.println("Session id: " + sessionResult.getId());
    System.out.println("Session status: " + sessionResult.getStatus());
    System.out.println("Liveness detection request id: " + sessionResult.getResult().getRequestId());
    System.out.println("Liveness detection received datetime: " + sessionResult.getResult().getReceivedDateTime());
    System.out.println("Liveness detection decision: " + sessionResult.getResult().getResponse().getBody().getLivenessDecision());
    System.out.println("Session created datetime: " + sessionResult.getCreatedDateTime());
    System.out.println("Auth token TTL (seconds): " + sessionResult.getAuthTokenTimeToLiveInSeconds());
    System.out.println("Session expired: " + sessionResult.isSessionExpired());
    System.out.println("Device correlation id: " + sessionResult.getDeviceCorrelationId());
    ```

    #### [Python](#tab/python)
    ```python
    liveness_result = await face_session_client.get_liveness_session_result(
        created_session.session_id
    )
    print(f"Session id: {liveness_result.id}")
    print(f"Session status: {liveness_result.status}")
    print(f"Liveness detection request id: {liveness_result.result.request_id}")
    print(f"Liveness detection received datetime: {liveness_result.result.received_date_time}")
    print(f"Liveness detection decision: {liveness_result.result.response.body.liveness_decision}")
    print(f"Session created datetime: {liveness_result.created_date_time}")
    print(f"Auth token TTL (seconds): {liveness_result.auth_token_time_to_live_in_seconds}")
    print(f"Session expired: {liveness_result.session_expired}")
    print(f"Device correlation id: {liveness_result.device_correlation_id}")
    ```

    #### [JavaScript](#tab/javascript)
    ```javascript
    const getLivenessSessionResultResponse = await client.path('/detectLiveness/singleModal/sessions/{sessionId}', createLivenessSessionResponse.body.sessionId).get();

    if (isUnexpected(getLivenessSessionResultResponse)) {
        throw new Error(getLivenessSessionResultResponse.body.error.message);
    }

    console.log(`Session id: ${getLivenessSessionResultResponse.body.id}`);
    console.log(`Session status: ${getLivenessSessionResultResponse.body.status}`);
    console.log(`Liveness detection request id: ${getLivenessSessionResultResponse.body.result?.requestId}`);
    console.log(`Liveness detection received datetime: ${getLivenessSessionResultResponse.body.result?.receivedDateTime}`);
    console.log(`Liveness detection decision: ${getLivenessSessionResultResponse.body.result?.response.body.livenessDecision}`);
    console.log(`Session created datetime: ${getLivenessSessionResultResponse.body.createdDateTime}`);
    console.log(`Auth token TTL (seconds): ${getLivenessSessionResultResponse.body.authTokenTimeToLiveInSeconds}`);
    console.log(`Session expired: ${getLivenessSessionResultResponse.body.sessionExpired}`);
    console.log(`Device correlation id: ${getLivenessSessionResultResponse.body.deviceCorrelationId}`);
    ```

    #### [REST API (Windows)](#tab/cmd)
    ```console
    curl --request GET --location "%FACE_ENDPOINT%/face/v1.1-preview.1/detectliveness/singlemodal/sessions/<session-id>" ^
    --header "Ocp-Apim-Subscription-Key: %FACE_APIKEY%"
    ```

    #### [REST API (Linux)](#tab/bash)
    ```bash
    curl --request GET --location "${FACE_ENDPOINT}/face/v1.1-preview.1/detectliveness/singlemodal/sessions/<session-id>" \
    --header "Ocp-Apim-Subscription-Key: ${FACE_APIKEY}"
    ```

    ---

    An example of the response body:
    ```json
    {
        "status": "ResultAvailable",
        "result": {
            "id": 1,
            "sessionId": "a3dc62a3-49d5-45a1-886c-36e7df97499a",
            "requestId": "cb2b47dc-b2dd-49e8-bdf9-9b854c7ba843",
            "receivedDateTime": "2023-10-31T16:50:15.6311565+00:00",
            "request": {
                "url": "/face/v1.1-preview.1/detectliveness/singlemodal",
                "method": "POST",
                "contentLength": 352568,
                "contentType": "multipart/form-data; boundary=--------------------------482763481579020783621915",
                "userAgent": ""
            },
            "response": {
                "body": {
                    "livenessDecision": "realface",
                    "target": {
                        "faceRectangle": {
                            "top": 59,
                            "left": 121,
                            "width": 409,
                            "height": 395
                        },
                        "fileName": "content.bin",
                        "timeOffsetWithinFile": 0,
                        "imageType": "Color"
                    },
                    "modelVersionUsed": "2022-10-15-preview.04"
                },
                "statusCode": 200,
                "latencyInMilliseconds": 1098
            },
            "digest": "537F5CFCD8D0A7C7C909C1E0F0906BF27375C8E1B5B58A6914991C101E0B6BFC"
        },
        "id": "a3dc62a3-49d5-45a1-886c-36e7df97499a",
        "createdDateTime": "2023-10-31T16:49:33.6534925+00:00",
        "authTokenTimeToLiveInSeconds": 600,
        "deviceCorrelationId": "723d6d03-ef33-40a8-9682-23a1feb7bccd",
        "sessionExpired": false
    }
    ```

1. The app server can delete the session if you don't query its result anymore.

    #### [C#](#tab/csharp)
    ```csharp
    await sessionClient.DeleteLivenessSessionAsync(sessionId);
    Console.WriteLine($"The session {sessionId} is deleted.");
    ```

    #### [Java](#tab/java)
    ```java
    sessionClient.deleteLivenessSession(creationResult.getSessionId());
    System.out.println("The session " + creationResult.getSessionId() + " is deleted.");
    ```

    #### [Python](#tab/python)
    ```python
    await face_session_client.delete_liveness_session(
        created_session.session_id
    )
    print(f"The session {created_session.session_id} is deleted.")
    await face_session_client.close()
    ```

    #### [JavaScript](#tab/javascript)
    ```javascript
    const deleteLivenessSessionResponse = await client.path('/detectLiveness/singleModal/sessions/{sessionId}', createLivenessSessionResponse.body.sessionId).delete();
    if (isUnexpected(deleteLivenessSessionResponse)) {
        throw new Error(deleteLivenessSessionResponse.body.error.message);
    }
    console.log(`The session ${createLivenessSessionResponse.body.sessionId} is deleted.`);
    ```

    #### [REST API (Windows)](#tab/cmd)
    ```console
    curl --request DELETE --location "%FACE_ENDPOINT%/face/v1.1-preview.1/detectliveness/singlemodal/sessions/<session-id>" ^
    --header "Ocp-Apim-Subscription-Key: %FACE_APIKEY%"
    ```

    #### [REST API (Linux)](#tab/bash)
    ```bash
    curl --request DELETE --location "${FACE_ENDPOINT}/face/v1.1-preview.1/detectliveness/singlemodal/sessions/<session-id>" \
    --header "Ocp-Apim-Subscription-Key: ${FACE_APIKEY}"
    ```

    ---

## Perform liveness detection with face verification

Combining face verification with liveness detection enables biometric verification of a particular person of interest with an added guarantee that the person is physically present in the system. 
There are two parts to integrating liveness with verification:
1. Select a good reference image.
2. Set up the orchestration of liveness with verification.

:::image type="content" source="../media/liveness/liveness-verify-diagram.jpg" alt-text="Diagram of the liveness-with-face-verification workflow of Azure AI Face." lightbox="../media/liveness/liveness-verify-diagram.jpg":::

### Select a good reference image

Use the following tips to ensure that your input images give the most accurate recognition results.

#### Technical requirements
[!INCLUDE [identity-input-technical](../includes/identity-input-technical.md)]
* You can utilize the `qualityForRecognition` attribute in the [face detection](../how-to/identity-detect-faces.md) operation when using applicable detection models as a general guideline of whether the image is likely of sufficient quality to attempt face recognition on. Only `"high"` quality images are recommended for person enrollment and quality at or above `"medium"` is recommended for identification scenarios.

#### Composition requirements
- Photo is clear and sharp, not blurry, pixelated, distorted, or damaged.
- Photo is not altered to remove face blemishes or face appearance.
- Photo must be in an RGB color supported format (JPEG, PNG, WEBP, BMP). Recommended Face size is 200 pixels x 200 pixels. Face sizes larger than 200 pixels x 200 pixels will not result in better AI quality, and no larger than 6 MB in size.
- User is not wearing glasses, masks, hats, headphones, head coverings, or face coverings. Face should be free of any obstructions.
- Facial jewelry is allowed provided they do not hide your face.
- Only one face should be visible in the photo.
- Face should be in neutral front-facing pose with both eyes open, mouth closed, with no extreme facial expressions or head tilt.
- Face should be free of any shadows or red eyes. Retake photo if either of these occur.
- Background should be uniform and plain, free of any shadows.
- Face should be centered within the image and fill at least 50% of the image.

### Set up the orchestration of liveness with verification.

The high-level steps involved in liveness with verification orchestration are illustrated below:
1. Providing the verification reference image by either of the following two methods:
    - The app server provides the reference image when creating the liveness session. More information regarding each request parameter involved in creating a liveness session with verification is referenced in [Liveness With Verify Create Session Operation](https://aka.ms/face-api-reference-createlivenesswithverifysession).

        #### [C#](#tab/csharp)
        ```csharp
        var endpoint = new Uri(System.Environment.GetEnvironmentVariable("FACE_ENDPOINT"));
        var credential = new AzureKeyCredential(System.Environment.GetEnvironmentVariable("FACE_APIKEY"));

        var sessionClient = new FaceSessionClient(endpoint, credential);

        var createContent = new CreateLivenessSessionContent(LivenessOperationMode.Passive)
        {
            DeviceCorrelationId = "723d6d03-ef33-40a8-9682-23a1feb7bccd"
        };
        using var fileStream = new FileStream("test.png", FileMode.Open, FileAccess.Read);

        var createResponse = await sessionClient.CreateLivenessWithVerifySessionAsync(createContent, fileStream);

        var sessionId = createResponse.Value.SessionId;
        Console.WriteLine("Session created.");
        Console.WriteLine($"Session id: {sessionId}");
        Console.WriteLine($"Auth token: {createResponse.Value.AuthToken}");
        Console.WriteLine("The reference image:");
        Console.WriteLine($"  Face rectangle: {createResponse.Value.VerifyImage.FaceRectangle.Top}, {createResponse.Value.VerifyImage.FaceRectangle.Left}, {createResponse.Value.VerifyImage.FaceRectangle.Width}, {createResponse.Value.VerifyImage.FaceRectangle.Height}");
        Console.WriteLine($"  The quality for recognition: {createResponse.Value.VerifyImage.QualityForRecognition}");
        ```

        #### [Java](#tab/java)
        ```java
        String endpoint = System.getenv("FACE_ENDPOINT");
        String accountKey = System.getenv("FACE_APIKEY");

        FaceSessionClient sessionClient = new FaceSessionClientBuilder()
            .endpoint(endpoint)
            .credential(new AzureKeyCredential(accountKey))
            .buildClient();

        CreateLivenessSessionContent parameters = new CreateLivenessSessionContent(LivenessOperationMode.PASSIVE)
            .setDeviceCorrelationId("723d6d03-ef33-40a8-9682-23a1feb7bccd")
            .setSendResultsToClient(false);

        Path path = Paths.get("test.png");
        BinaryData data = BinaryData.fromFile(path);
        CreateLivenessWithVerifySessionResult creationResult = sessionClient.createLivenessWithVerifySession(parameters, data);

        System.out.println("Session created.");
        System.out.println("Session id: " + creationResult.getSessionId());
        System.out.println("Auth token: " + creationResult.getAuthToken());
        System.out.println("The reference image:");
        System.out.println("  Face rectangle: " + creationResult.getVerifyImage().getFaceRectangle().getTop() + " " + creationResult.getVerifyImage().getFaceRectangle().getLeft() + " " + creationResult.getVerifyImage().getFaceRectangle().getWidth() + " " + creationResult.getVerifyImage().getFaceRectangle().getHeight());
        System.out.println("  The quality for recognition: " + creationResult.getVerifyImage().getQualityForRecognition());
        ```

        #### [Python](#tab/python)
        ```python
        endpoint = os.environ["FACE_ENDPOINT"]
        key = os.environ["FACE_APIKEY"]

        face_session_client = FaceSessionClient(endpoint=endpoint, credential=AzureKeyCredential(key))

        reference_image_path = "test.png"
        with open(reference_image_path, "rb") as fd:
            reference_image_content = fd.read()

        created_session = await face_session_client.create_liveness_with_verify_session(
            CreateLivenessSessionContent(
                liveness_operation_mode=LivenessOperationMode.PASSIVE,
                device_correlation_id="723d6d03-ef33-40a8-9682-23a1feb7bccd",
            ),
            verify_image=reference_image_content,
        )
        print("Session created.")
        print(f"Session id: {created_session.session_id}")
        print(f"Auth token: {created_session.auth_token}")
        print("The reference image:")
        print(f"  Face rectangle: {created_session.verify_image.face_rectangle}")
        print(f"  The quality for recognition: {created_session.verify_image.quality_for_recognition}")
        ```

        #### [JavaScript](#tab/javascript)
        ```javascript
        const endpoint = process.env['FACE_ENDPOINT'];
        const apikey = process.env['FACE_APIKEY'];

        const credential = new AzureKeyCredential(apikey);
        const client = createFaceClient(endpoint, credential);

        const createLivenessSessionResponse = await client.path('/detectLivenessWithVerify/singleModal/sessions').post({
            contentType: 'multipart/form-data',
            body: [
                {
                    name: 'VerifyImage',
                    // Note that this utilizes Node.js API.
                    // In browser environment, please use file input or drag and drop to read files.
                    body: readFileSync('test.png'),
                },
                {
                    name: 'Parameters',
                    body: {
                        livenessOperationMode: 'Passive',
                        deviceCorrelationId: '723d6d03-ef33-40a8-9682-23a1feb7bccd',
                    },
                },
            ],
        });

        if (isUnexpected(createLivenessSessionResponse)) {
            throw new Error(createLivenessSessionResponse.body.error.message);
        }

        console.log('Session created:');
        console.log(`Session ID: ${createLivenessSessionResponse.body.sessionId}`);
        console.log(`Auth token: ${createLivenessSessionResponse.body.authToken}`);
        console.log('The reference image:');
        console.log(`  Face rectangle: ${createLivenessSessionResponse.body.verifyImage.faceRectangle}`);
        console.log(`  The quality for recognition: ${createLivenessSessionResponse.body.verifyImage.qualityForRecognition}`)
        ```

        #### [REST API (Windows)](#tab/cmd)
        ```console
        curl --request POST --location "%FACE_ENDPOINT%/face/v1.1-preview.1/detectlivenesswithverify/singlemodal/sessions" ^
        --header "Ocp-Apim-Subscription-Key: %FACE_APIKEY%" ^
        --form "Parameters=""{\\\""livenessOperationMode\\\"": \\\""passive\\\"", \\\""deviceCorrelationId\\\"": \\\""723d6d03-ef33-40a8-9682-23a1feb7bccd\\\""}""" ^
        --form "VerifyImage=@""test.png"""
        ```

        #### [REST API (Linux)](#tab/bash)
        ```bash
        curl --request POST --location "${FACE_ENDPOINT}/face/v1.1-preview.1/detectlivenesswithverify/singlemodal/sessions" \
        --header "Ocp-Apim-Subscription-Key: ${FACE_APIKEY}" \
        --form 'Parameters="{
            \"livenessOperationMode\": \"passive\",
            \"deviceCorrelationId\": \"723d6d03-ef33-40a8-9682-23a1feb7bccd\"
        }"' \
        --form 'VerifyImage=@"test.png"'
        ```

        ---

        An example of the response body:
        ```json
        {
            "verifyImage": {
                "faceRectangle": {
                    "top": 506,
                    "left": 51,
                    "width": 680,
                    "height": 475
                },
                "qualityForRecognition": "high"
            },
            "sessionId": "3847ffd3-4657-4e6c-870c-8e20de52f567",
            "authToken": "<session-authorization-token>"
        }
        ```

    - The frontend application provides the reference image when initializing the SDK. This scenario is not supported in the web solution.

        #### [Android](#tab/mobile-kotlin)
        ```kotlin
        val singleFaceImageSource = VisionSource.fromFile("/path/to/image.jpg")
        mFaceAnalysisOptions?.setRecognitionMode(RecognitionMode.valueOfVerifyingMatchToFaceInSingleFaceImage(singleFaceImageSource))
        ```

        #### [iOS](#tab/mobile-swift)
        ```swift
        if let path = Bundle.main.path(forResource: "<IMAGE_RESOURCE_NAME>", ofType: "<IMAGE_RESOURCE_TYPE>"),
           let image = UIImage(contentsOfFile: path),
           let singleFaceImageSource = try? VisionSource(uiImage: image) {
           try methodOptions.setRecognitionMode(.verifyMatchToFaceIn(singleFaceImage: singleFaceImageSource))
        }
        ```

        #### [Web](#tab/web-javascript)
        ```javascript
        Not supported.
        ```

        ---

1. The app server can now query for the verification result in addition to the liveness result.

    #### [C#](#tab/csharp)
    ```csharp
    var getResultResponse = await sessionClient.GetLivenessWithVerifySessionResultAsync(sessionId);
    var sessionResult = getResultResponse.Value;
    Console.WriteLine($"Session id: {sessionResult.Id}");
    Console.WriteLine($"Session status: {sessionResult.Status}");
    Console.WriteLine($"Liveness detection request id: {sessionResult.Result?.RequestId}");
    Console.WriteLine($"Liveness detection received datetime: {sessionResult.Result?.ReceivedDateTime}");
    Console.WriteLine($"Liveness detection decision: {sessionResult.Result?.Response.Body.LivenessDecision}");
    Console.WriteLine($"Verification result: {sessionResult.Result?.Response.Body.VerifyResult.IsIdentical}");
    Console.WriteLine($"Verification confidence: {sessionResult.Result?.Response.Body.VerifyResult.MatchConfidence}");
    Console.WriteLine($"Session created datetime: {sessionResult.CreatedDateTime}");
    Console.WriteLine($"Auth token TTL (seconds): {sessionResult.AuthTokenTimeToLiveInSeconds}");
    Console.WriteLine($"Session expired: {sessionResult.SessionExpired}");
    Console.WriteLine($"Device correlation id: {sessionResult.DeviceCorrelationId}");
    ```

    #### [Java](#tab/java)
    ```java
    LivenessWithVerifySession sessionResult = sessionClient.getLivenessWithVerifySessionResult(creationResult.getSessionId());
    System.out.println("Session id: " + sessionResult.getId());
    System.out.println("Session status: " + sessionResult.getStatus());
    System.out.println("Liveness detection request id: " + sessionResult.getResult().getRequestId());
    System.out.println("Liveness detection received datetime: " + sessionResult.getResult().getReceivedDateTime());
    System.out.println("Liveness detection decision: " + sessionResult.getResult().getResponse().getBody().getLivenessDecision());
    System.out.println("Verification result: " + sessionResult.getResult().getResponse().getBody().getVerifyResult().isIdentical());
    System.out.println("Verification confidence: " + sessionResult.getResult().getResponse().getBody().getVerifyResult().getMatchConfidence());
    System.out.println("Session created datetime: " + sessionResult.getCreatedDateTime());
    System.out.println("Auth token TTL (seconds): " + sessionResult.getAuthTokenTimeToLiveInSeconds());
    System.out.println("Session expired: " + sessionResult.isSessionExpired());
    System.out.println("Device correlation id: " + sessionResult.getDeviceCorrelationId());
    ```

    #### [Python](#tab/python)
    ```python
    liveness_result = await face_session_client.get_liveness_with_verify_session_result(
        created_session.session_id
    )
    print(f"Session id: {liveness_result.id}")
    print(f"Session status: {liveness_result.status}")
    print(f"Liveness detection request id: {liveness_result.result.request_id}")
    print(f"Liveness detection received datetime: {liveness_result.result.received_date_time}")
    print(f"Liveness detection decision: {liveness_result.result.response.body.liveness_decision}")
    print(f"Verification result: {liveness_result.result.response.body.verify_result.is_identical}")
    print(f"Verification confidence: {liveness_result.result.response.body.verify_result.match_confidence}")
    print(f"Session created datetime: {liveness_result.created_date_time}")
    print(f"Auth token TTL (seconds): {liveness_result.auth_token_time_to_live_in_seconds}")
    print(f"Session expired: {liveness_result.session_expired}")
    print(f"Device correlation id: {liveness_result.device_correlation_id}")
    ```

    #### [JavaScript](#tab/javascript)
    ```javascript
    const getLivenessSessionResultResponse = await client.path('/detectLivenessWithVerify/singleModal/sessions/{sessionId}', createLivenessSessionResponse.body.sessionId).get();
    if (isUnexpected(getLivenessSessionResultResponse)) {
        throw new Error(getLivenessSessionResultResponse.body.error.message);
    }

    console.log(`Session id: ${getLivenessSessionResultResponse.body.id}`);
    console.log(`Session status: ${getLivenessSessionResultResponse.body.status}`);
    console.log(`Liveness detection request id: ${getLivenessSessionResultResponse.body.result?.requestId}`);
    console.log(`Liveness detection received datetime: ${getLivenessSessionResultResponse.body.result?.receivedDateTime}`);
    console.log(`Liveness detection decision: ${getLivenessSessionResultResponse.body.result?.response.body.livenessDecision}`);
    console.log(`Verification result: ${getLivenessSessionResultResponse.body.result?.response.body.verifyResult.isIdentical}`);
    console.log(`Verification confidence: ${getLivenessSessionResultResponse.body.result?.response.body.verifyResult.matchConfidence}`);
    console.log(`Session created datetime: ${getLivenessSessionResultResponse.body.createdDateTime}`);
    console.log(`Auth token TTL (seconds): ${getLivenessSessionResultResponse.body.authTokenTimeToLiveInSeconds}`);
    console.log(`Session expired: ${getLivenessSessionResultResponse.body.sessionExpired}`);
    console.log(`Device correlation id: ${getLivenessSessionResultResponse.body.deviceCorrelationId}`);
    ```

    #### [REST API (Windows)](#tab/cmd)
    ```console
    curl --request GET --location "%FACE_ENDPOINT%/face/v1.1-preview.1/detectlivenesswithverify/singlemodal/sessions/<session-id>" ^
    --header "Ocp-Apim-Subscription-Key: %FACE_APIKEY%"
    ```

    #### [REST API (Linux)](#tab/bash)
    ```bash
    curl --request GET --location "${FACE_ENDPOINT}/face/v1.1-preview.1/detectlivenesswithverify/singlemodal/sessions/<session-id>" \
    --header "Ocp-Apim-Subscription-Key: ${FACE_APIKEY}"
    ```

    ---

    An example of the response body:
    ```json
    {
        "status": "ResultAvailable",
        "result": {
            "id": 1,
            "sessionId": "3847ffd3-4657-4e6c-870c-8e20de52f567",
            "requestId": "f71b855f-5bba-48f3-a441-5dbce35df291",
            "receivedDateTime": "2023-10-31T17:03:51.5859307+00:00",
            "request": {
                "url": "/face/v1.1-preview.1/detectlivenesswithverify/singlemodal",
                "method": "POST",
                "contentLength": 352568,
                "contentType": "multipart/form-data; boundary=--------------------------590588908656854647226496",
                "userAgent": ""
            },
            "response": {
                "body": {
                    "livenessDecision": "realface",
                    "target": {
                        "faceRectangle": {
                            "top": 59,
                            "left": 121,
                            "width": 409,
                            "height": 395
                        },
                        "fileName": "content.bin",
                        "timeOffsetWithinFile": 0,
                        "imageType": "Color"
                    },
                    "modelVersionUsed": "2022-10-15-preview.04",
                    "verifyResult": {
                        "matchConfidence": 0.9304124,
                        "isIdentical": true
                    }
                },
                "statusCode": 200,
                "latencyInMilliseconds": 1306
            },
            "digest": "2B39F2E0EFDFDBFB9B079908498A583545EBED38D8ACA800FF0B8E770799F3BF"
        },
        "id": "3847ffd3-4657-4e6c-870c-8e20de52f567",
        "createdDateTime": "2023-10-31T16:58:19.8942961+00:00",
        "authTokenTimeToLiveInSeconds": 600,
        "deviceCorrelationId": "723d6d03-ef33-40a8-9682-23a1feb7bccd",
        "sessionExpired": true
    }
    ```

1. The app server can delete the session if you don't query its result anymore.

    #### [C#](#tab/csharp)
    ```csharp
    await sessionClient.DeleteLivenessWithVerifySessionAsync(sessionId);
    Console.WriteLine($"The session {sessionId} is deleted.");
    ```

    #### [Java](#tab/java)
    ```java
    sessionClient.deleteLivenessWithVerifySession(creationResult.getSessionId());
    System.out.println("The session " + creationResult.getSessionId() + " is deleted.");
    ```

    #### [Python](#tab/python)
    ```python
    await face_session_client.delete_liveness_with_verify_session(
        created_session.session_id
    )
    print(f"The session {created_session.session_id} is deleted.")
    await face_session_client.close()
    ```

    #### [JavaScript](#tab/javascript)
    ```javascript
    const deleteLivenessSessionResponse = await client.path('/detectLivenessWithVerify/singleModal/sessions/{sessionId}', createLivenessSessionResponse.body.sessionId).delete();
    if (isUnexpected(deleteLivenessSessionResponse)) {
        throw new Error(deleteLivenessSessionResponse.body.error.message);
    }
    console.log(`The session ${createLivenessSessionResponse.body.sessionId} is deleted.`);
    ```

    #### [REST API (Windows)](#tab/cmd)
    ```console
    curl --request DELETE --location "%FACE_ENDPOINT%/face/v1.1-preview.1/detectlivenesswithverify/singlemodal/sessions/<session-id>" ^
    --header "Ocp-Apim-Subscription-Key: %FACE_APIKEY%"
    ```

    #### [REST API (Linux)](#tab/bash)
    ```bash
    curl --request DELETE --location "${FACE_ENDPOINT}/face/v1.1-preview.1/detectlivenesswithverify/singlemodal/sessions/<session-id>" \
    --header "Ocp-Apim-Subscription-Key: ${FACE_APIKEY}"
    ```

    ---

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Azure portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

To learn about other options in the liveness APIs, see the Azure AI Vision SDK reference.

- [Kotlin (Android)](https://aka.ms/liveness-sample-java)
- [Swift (iOS)](https://aka.ms/azure-ai-vision-face-liveness-client-sdk-ios-readme)
- [JavaScript (Web)](https://aka.ms/azure-ai-vision-face-liveness-client-sdk-web-readme)

To learn more about the features available to orchestrate the liveness solution, see the Session REST API reference.

- [Liveness Session Operations](/rest/api/face/liveness-session-operations)
