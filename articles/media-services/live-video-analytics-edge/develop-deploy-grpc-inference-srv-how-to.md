---
title: Develop and deploy a gRPC inference server - Azure
description: This article provides guidance on how to develop and deploy a gRPC inference server.
ms.topic: how-to
ms.date: 12/02/2020

---

# How-to-Guide – Develop and deploy a gRPC inference server

## Overview

This article shows you how you can wrap AI model(s) of your choice within a gRPC inference server, so that it can be integrated with Live Video Analytics (LVA) via graph extension. 

## Suggested pre-reading

* [Media Graph extensions](media-graph-extension-concept.md)
* [gRPC extension protocol](grpc-extension-protocol.md)
* [Inference Metadata schema](inference-metadata-schema.md)
* [Introduction to gRPC](https://www.grpc.io/docs/what-is-grpc/introduction/)
* [proto3 Language guide](https://developers.google.com/protocol-buffers/docs/proto3)

## Prerequisites

* An x86-64 or an ARM64 device running one of the [supported Linux operating systems](../../iot-edge/support.md#operating-systems) or a Windows machine.
* [Install Docker](https://docs.docker.com/desktop/#download-and-install) on your machine.
* Install [IoT Edge runtime](../../iot-edge/how-to-install-iot-edge.md?tabs=linux).

## gRPC implementation steps

To create a gRPC inference server and implement it as an extension with Live Video Analytics, following steps will be used:

### Setup:

Perform the necessary steps to have [Live Video Analytics  module deployed and working on an IoT Edge device](deploy-iot-edge-device.md).

### High level Implementation Steps:

1. Choose one of the many languages that are supported by gRPC: C#, C++, Dart, Go, Java, Node, Objective-C, PHP, Python, Ruby.
1. Implement a gRPC Server that will communicate with Live Video Analytics using [the proto3 files](https://github.com/Azure/live-video-analytics/tree/master/contracts/grpc).

    :::image type="content" source="./media/develop-deploy-grpc-inference-srv-how-to/inference-srv-container-process.png" alt-text="gRPC Server that will communicate with Live Video Analytics using the proto3 files":::

    Within this service:
    1. Handle session description message exchange between the server and the client.
    1. Handle [media sample messages](https://github.com/Azure/live-video-analytics/blob/master/contracts/grpc/extension.proto) and return results.

        1. Invoke your inferencing engine that uses a trained model to make inferences on the incoming messages.
        1. Receive inferencing results from the engine, package them back as a media sample and submit back to Live Video Analytics using the [inferencing.proto](https://github.com/Azure/live-video-analytics/blob/master/contracts/grpc/inferencing.proto) file.

            Alternatively, invoke any media transformation function to the media sample.
1. Deploy the gRPC server implementation. There are two ways of doing this:

    1. Deploy as an IoT module co-located with Live Video Analytics  module
    1. Deploy as an IoT module to a network accessible node (on premise or on cloud) that can exchange data with the Live Video Analytics  module.
1. Configure an Live Video Analytics graph topology with the Live Video Analytics module and point it to the gRPC server.

### Recommendation:

When collocating on the same node, shared memory can be used for best performance. This requires you to use Linux shared memory capabilities exposed by the programming language/environment.

1. Open the Linux shared memory handle.
1. Upon receiving of a frame, access the address offset within the shared memory.
1. Acknowledge the frame processing completion so its memory can be reclaimed by Live Video Analytics.

## Create a gRPC inference server

Now you will build an IoT Edge module (External AI) that accepts video frames from Live Video Analytics using [protobuf](https://github.com/Azure/live-video-analytics/tree/master/contracts/grpc) messages via shared memory, classify the frames as “dark” or “light” and return inference results back to the IoT Hub Message Sink in Live Video Analytics using the [inference metadata schema](inference-metadata-schema.md).

:::image type="content" source="./media/develop-deploy-grpc-inference-srv-how-to/external-ai.png" alt-text="build an IoT Edge module (External AI)":::

This gRPC inference server is a .NET Core console application built handle the [protobuf](https://github.com/Azure/live-video-analytics/tree/master/contracts/grpc) messages sent between Live Video Analytics and your custom AI. Following is the flow of messages between Live Video Analytics and the gRPC inference server:

1. Live Video Analytics sends a media stream descriptor (see [extension.proto](https://github.com/Azure/live-video-analytics/blob/master/contracts/grpc/extension.proto)) which defines the media stream information that will be sent followed by video frames to the server as a [protobuf](https://github.com/Azure/live-video-analytics/tree/master/contracts/grpc) message over the gRPC stream session. 
1. The server validates and acknowledges the stream descriptor and sets up the desired data transfer method.
1. Live Video Analytics then starts sending the MediaSample files which contain the video frames.
1. The server analyses the video frames as it receives and starts processing them using an Image Processor defined by you.
1. The server then returns inference results as [protobuf](https://github.com/Azure/live-video-analytics/tree/master/contracts/grpc) messages as soon as they are available. 

    :::image type="content" source="./media/develop-deploy-grpc-inference-srv-how-to/grpc-external-srv.png" alt-text="Create a gRPC inference server":::

The video frames can be transferred either through [shared memory](https://en.wikipedia.org/wiki/Shared_memory#:~:text=In%20computer%20science%2C%20shared%20memory,of%20passing%20data%20between%20programs.) or they can be embedded within the protobuf message. The data transfer mode can be configured in the LVA graph topology to determine how frames will be transferred. This is achieved by configuring the **dataTransfer** element of the MediaGraphGrpcExtension property as shown below:

Embedded:

```
"dataTransfer": {
              "mode": "Embedded"
            }
```

Shared memory:

```
"dataTransfer": {
              "mode": "sharedMemory",
              "SharedMemorySizeMiB": "20"
            }
```

> [!NOTE]
> When communicating over shared memory, the value of IpcMode should be set to **shareable** and in the gRPC server module set the value of IpcMode to **container:{CONTAINER_NAME}**. These settings are to be made in the deployment manifest file that is used for deploying the modules to the Azure IoT Hub. Below is a sample of the container options to use when setting up the IoT Edge modules.

Live Video Analytics module:

```
{
    "HostConfig": {
        "LogConfig": {
            "Config": {
                "max-size": "10m",
                "max-file": "10"
            }
        },
        "IpcMode": "shareable"
    }
}
```

gRPC extension module:

```
{
    "HostConfig": {
        "LogConfig": {
            "Config": {
                "max-size": "10m",
                "max-file": "10"
            }
        },
        "IpcMode": "container:lvaEdge"
    }
}
```

> [!NOTE]
> Ensure that you can access the shared memory area of “container:lvaEdge” within the grpcExtension.

## Sample gRPC Server

To understand the details of how gRPC server is developed, let’s go through our code sample.

1. Clone the repo from the GitHub link [https://github.com/Azure-Samples/live-video-analytics-iot-edge-csharp](https://github.com/Azure-Samples/live-video-analytics-iot-edge-csharp).
1. Launch VSCode and navigate to the /src/edge/modules/grpcExtension folder.
1. Let's do a quick walkthrough of the files:

    1. **Program.cs**: this is the entry point of the application. It is responsible for initializing and managing the gRPC server, which will act as a host. In our sample, the port to listen for incoming gRPC messages from a gRPC client (such as Live Video Analytics) on is specified by the grpcBindings configuration element in the AppConfig.json.
    
        ```json    
        {
          "grpcBinding": "tcp://0.0.0.0:5001"
        }
        ```
    1. **Services\MediaGraphExtensionService.cs**: This class is responsible for handling the [protobuf](https://github.com/Azure/live-video-analytics/tree/master/contracts/grpc) messages. It will read the frame in the message, invoke the ImageProcessor and write the inference results.
Now that we have configured and initialized the gRPC server port connections, let’s look into how we can process the incoming gRPC messages.

        * Once a gRPC session is established, the very first message that the gRPC server will receive from the client (Live Video Analytics) is a MediaStreamDescriptor which is defined in the [extension.proto](https://github.com/Azure/live-video-analytics/blob/master/contracts/grpc/extension.proto) file. 

            ```
            message MediaStreamDescriptor {
              oneof stream_identifier {
                GraphIdentifier graph_identifier = 1;     // Media Stream graph identifier
                string extension_identifier = 2;          // Media Stream extension identifier
              }
              MediaDescriptor media_descriptor = 5;       // Session media information.
              // Additional data transfer properties. If none is set, it is assumed
              // that all content will be transferred through messages (embedded transfer).
              oneof data_transfer_properties {
                SharedMemoryBufferTransferProperties shared_memory_buffer_transfer_properties = 10;
              }
            }
            ```
        * In our server implementation, the method `ProcessMediaStreamDescriptor` will validate the MediaStreamDescriptor’s MediaDescriptor property for a Video file and then will setup the data transfer mode (which is either using shared memory or using embedded frame transfer mode) depending on what you specify in the topology and the deployment template file used. 
        * Upon receiving the message and successfully setting up the data transfer mode, the gRPC server then returns the MediaStreamDescriptor message back to the client as an acknowledgment and thus establishing a connection between the server and the client.    
        * After Live Video Analytics receives the acknowledgment, it will start transferring media stream to the gRPC server. In our server implementation, the method `ProcessMediaStream` will process the incoming MediaStreamMessage. The MediaStreamMessage is also defined in the [extension.proto](https://github.com/Azure/live-video-analytics/blob/master/contracts/grpc/extension.proto).

            ```
            message MediaStreamMessage {
              uint64 sequence_number = 1;       // Monotonically increasing directional message identifier starting from 1 when the gRPC connection is created
              uint64 ack_sequence_number = 2;   // 0 if this message is not referencing any sent message.
            
            
              // Possible payloads are strongly defined by the contract below
              oneof payload {
                MediaStreamDescriptor media_stream_descriptor = 5;
                MediaSample media_sample = 6;
              }
            }
            ```
        * Depending on the value of batchSize in the Appconfig.json, our server will keep receiving the messages and will store the video frames in a List. Once the batchSize limit is reached, the function will call the function or the file that will process the image. In our case, the method calls a file called BatchImageProcessor.cs
    1. **Processors\BatchImageProcessor.cs**: This class is responsible for processing the image(s). We have used an image classification model in this sample. For every image that will be processed, the algorithm used is the following:

        1. Convert the image in a byte array for processing. See method: `GetBytes(Bitmap image)`
        
            The sample processor we're using only supports JPG encoded image frame and None as pixel format. In case your custom processor supports a different encoding and/or format, update the `IsMediaFormatSupported` method of the processor class.
        1. Using the [ColorMatrix class](/dotnet/api/system.drawing.imaging.colormatrix?preserve-view=true&view=dotnet-plat-ext-3.1), convert the image to gray scale. See method: `ToGrayScale(Image source)`.
        1. Once we get the gray scale image, we then calculate the average of the gray scale bytes.
        1. If the average value < 127, then we classify the image as “dark”, else we will classify them as “light” with confidence value as 1.0. See method: `ProcessImage(List<Image> images)`.

    You can add your own processor logic by either modifying this class or by adding a new class and implementing the method:

    ```
    IEnumerable<Inference> ProcessImage(List<Image> images) 
    ```

    Once you've added the new class, you'll have to update the MediaGraphExtensionService.cs so it instantiates your class and invokes the ProcessImage method on it to run your processing logic. 

## Connect with Live Video Analytics module

Now that you have created your gRPC extension module, we will now create and deploy the media graph topology.

1. Using Visual Studio Code, follow [these instructions](../../iot-edge/tutorial-develop-for-linux.md#build-and-push-your-solution) to sign in to Docker.
1. In Visual Studio Code, go to src/edge. You see your .env file and a few deployment template files.

    The deployment template refers to the deployment manifest for the edge device. It includes some placeholder values. The .env file includes the values for those variables.
    
    Then select Build and Push IoT Edge Solution. Use src/edge/deployment.grpc.template.json for this step.
        
    :::image type="content" source="./media/develop-deploy-grpc-inference-srv-how-to/build-push-iot-edge-solution.png" alt-text="Connect with Live Video Analytics module":::
    
    This action builds the grpc server module and pushes the image to your Azure Container Registry.
    Check that you have the environment variables CONTAINER_REGISTRY_USERNAME_myacr and CONTAINER_REGISTRY_PASSWORD_myacr defined in the .env file.
1. Go to the src/cloud-to-device-console-app folder. Here you see your appsettings.json file and a few other files:

    * c2d-console-app.csproj - The project file for Visual Studio Code.
    * operations.json - A list of the operations that you want the program to run.
    * Program.cs - The sample program code. This code:

        * Loads the app settings.
        * Invokes direct methods that the Live Video Analytics on IoT Edge module exposes. You can use the module to analyze live video streams by invoking its [direct methods](direct-methods.md).
        * Pauses so that you can examine the program's output in the TERMINAL window and examine the events that were generated by the module in the OUTPUT window.
        * Invokes direct methods to clean up resources.
1. Edit the operations.json file:

    * Change the link to the graph topology:

        * `"topologyUrl" : https://raw.githubusercontent.com/Azure/live-video-analytics/master/MediaGraph/topologies/grpcExtension/topology.json`
        * Under GraphInstanceSet, edit the name of the graph topology to match the value in the preceding link:<br/>`"topologyName": "InferencingWithGrpcExtension"`
        * Under GraphTopologyDelete, edit the name:<br/>`"name": "InferencingWithGrpcExtension"`

            The topology (for example, `https://github.com/Azure/live-video-analytics/blob/master/MediaGraph/topologies/grpcExtension/topology.json`) must define an extension address:
    * Extension address Parameter

        ```
        {
            "name": "grpcExtensionAddress",
            "type": "String",
            "description": "gRPC LVA Extension Address",
            "default": "https://<REPLACE-WITH-IP-OR-CONTAINER-NAME>/score"
        },
        ```
    * Configuration

        ```
        {
        	"@apiVersion": "1.0",
        	"name": "TopologyName",
        	"properties": {
            "processors": [
              {
                "@type": "#Microsoft.Media.MediaGraphGrpcExtension",
                "name": "grpcExtension",
                "endpoint": {
                  "@type": "#Microsoft.Media.MediaGraphUnsecuredEndpoint",
                  "url": "${grpcExtensionAddress}",
                  "credentials": {
                    "@type": "#Microsoft.Media.MediaGraphUsernamePasswordCredentials",
                    "username": "${grpcExtensionUserName}",
                    "password": "${grpcExtensionPassword}"
                  }
                },
                "dataTransfer": {
                		"mode": "sharedMemory",
                		"SharedMemorySizeMiB": "5"
            	},
                "image": {
                  "scale": {
                    "mode": "${imageScaleMode}",
                    "width": "${frameWidth}",
                    "height": "${frameHeight}"
                  },
                  "format": {
                    "@type": "#Microsoft.Media.MediaGraphImageFormatEncoded",
                    "encoding": "${imageEncoding}",
                    "quality": "${imageQuality}"
                  }
                }
            ]
          }
        }
        ```
    
## Generate and deploy the IoT Edge deployment manifest

The deployment manifest defines what modules are deployed to an edge device and the configuration settings for those modules. Follow these steps to generate a manifest from the template file, and then deploy it to the edge device.
This step creates the IoT Edge deployment manifest at src/edge/config/deployment.grpc.amd64.json. Right-click that file and select **Create Deployment for Single Device**.

:::image type="content" source="./media/develop-deploy-grpc-inference-srv-how-to/create-deployment-single-device.png" alt-text="Generate and deploy the IoT Edge deployment manifest":::

Next, Visual Studio Code asks you to select an IoT Hub device. Select your IoT Edge device, which should be lva-sample-device.
At this stage, the deployment of edge modules to your IoT Edge device has started. In about 30 seconds, refresh Azure IoT Hub in the lower-left section in Visual Studio Code. You should see that a new module got deployed named lvaExtension.

:::image type="content" source="./media/develop-deploy-grpc-inference-srv-how-to/devices.png" alt-text="A new module got deployed named lvaExtension":::

## Next steps

Follow the **Prepare to monitor events** steps mentioned in the [Analyze live video with your model](use-your-model-quickstart.md) quickstart to run the sample and interpret the results. 
Also, check out our sample gRPC topologies: [gRPCExtension](https://github.com/Azure/live-video-analytics/blob/master/MediaGraph/topologies/grpcExtension/topology.json), [CVRWithGrpcExtension](https://github.com/Azure/live-video-analytics/blob/master/MediaGraph/topologies/cvr-with-grpcExtension/topology.json), [EVRtoAssetsByGrpcExtension, and [EVROnMotionPlusGrpcExtension](https://github.com/Azure/live-video-analytics/blob/master/MediaGraph/topologies/motion-with-grpcExtension/topology.json).