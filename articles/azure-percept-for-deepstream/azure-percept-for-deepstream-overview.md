---
title: Azure Percept for DeepStream overview
description: A description of Azure Percept for DeepStream developer tools that provide a custom developer experience. 
author: MaxStrange
ms.author: strangem
manager: amiyouss
ms.service: azure-percept
ms.topic: overview
ms.date: 08/10/2022
---

# Azure Percept for DeepStream Overview

Azure Percept for DeepStream includes developer tools that provide a custom developer experience. It enables you to create NVIDIA DeepStream containers using Microsoft-based images and guidance, supported models from NVIDIA out of the box, and/or bring your own models. 

DeepStream is NVIDIA’s toolkit to develop and deploy Vision AI applications and services. It provides multi-platform, scalable, Transport Layer Security (TLS)-encrypted security that can be deployed on-premises, on the edge, and in the cloud. 

## Azure Percept for DeepStream offers:

- **Simplifying your development process** 

  Auto selection of AI model execution and inference provider: One of several execution providers, such as ORT, CUDA, and TENSORT, are automatically selected to simplify your development process.

- **Customizing Region of Interest (ROI) to enable your business scenario**

  Region of Interest (ROI) configuration widget: Percept Player, a web app widget, is included for customizing ROIs to enable event detection for your business scenario.

- **Simplifying the configuration for pre/post processing** 

  You can add a Python-based model/parser using a configuration file, instead of hardcoding it into the pipeline.

- **Offering a broad Pre-built AI model framework** 

  This solution supports many of the most common CV models in use today, for example NVIDIA TAO, ONNX, CAFFE, UFF (TensorFlow), and Triton.

- **Supporting bring your own model** 

  Support for model/container customization, USB/RTSP camera and pre-recorded video stream(s), event-based video snippet storage in Azure Storage and Alerts, and AI model deployment via Azure IoT Module Twin update.

## Azure Percept for DeepStream key components  

The following table provides a list of Azure Percept for DeepStream’s key components and a description of each one.

| Components              | Details                      | 
|-------------------------|------------------------------|             
| **Edge devices**            | Azure Percept for DeepStream is available on the following devices: <li>[Azure Stack HCI](https://docs.microsoft.com/en-us/azure-stack/hci/overview): Requires a NVIDIA GPU (T4 or A2)</li><li>[NVIDIA Jetson Orin](https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/)</li><li>[NVIDIA Jetson Xavier](https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-agx-xavier/)</li><br>**Note**<br>You can use any of the listed devices with any of the development paths. Some implementation steps may differ depending on the architecture of your device. Azure Stack HCI uses AMD64. Jetson devices use ARM64.                     | 
| **Computer vision models**  | Azure Percept for DeepStream can work with many different computer vision (CV) models as outlined: <li>**NVIDIA Models** <br>For example: Body Pose Estimation and License Plate Recognition. License Plate Recognition includes three models: traffic cam net, license plate detection, and license plate reading and other Nivida Models.</li><li>**ONNX Models** <br>For example: SSD-MobileNetV1, YOLOv4, Tiny YOLOv3, EfficentNet-Lite.</li>                | 
| **Development Paths**       | Azure Percept for DeepStream offers three development paths:<li>**Getting started path** <br>This path uses pre-trained models and pre-recorded videos of simulated manufacturing environment to demonstrate the steps required to create an Edge AI solution using Azure Percept for DeepStream.<br>If you are just getting started on your computer vision (CV) app journey or simply want to learn more about Azure Percept for DeepStream, we recommend this path.</li><li>**Pre-built model path** <br>This path provides pre-built parsers in Python for the CV models outlined earlier. You can easily deploy one of these models and integrate your own video stream.</li> <li>**Bring your own model (BYOM) path**<br>This path provides you with steps of how to integrate your own custom model and parser into your Azure Percept for DeepStream Edge AI solution.<br>If you are an experienced developer who is familiar with cloud-based CV solutions and want a simplified deployment experience Azure Percept for DeepStream, we recommend this path.</li>                  | 

## Next steps

You are now ready to start using Azure Percept for DeepStream to create, manage, and deploy custom Edge AI solutions. We recommend the following resources to get started:  

- [Getting started checklist for Azure Percept for DeepStream](https://microsoft.sharepoint-df.com/:w:/t/AzurePerceptHCIDocumentation/EeWQwQ8T-LVDmTMqC62Gss0Bo_1Fbjj9I8mDSLYwlICd_Q?e=f9FajM)

- [Tutorial: Deploy a simulated manufacturing defect detection model using Azure Percept and DeepStream](https://microsoft.sharepoint-df.com/:w:/t/AzurePerceptHCIDocumentation/EbQFPiaksEZFut0dZFxFla0BscJl-O7I-NtyIAhSjkebFA?e=6Gnblo) 

