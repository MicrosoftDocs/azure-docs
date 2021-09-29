---
title: Connecting camera to cloud using a transparent gateway
description: This article explains how to connect a camera to Azure Video Analyzer using a transparent gateway. 
ms.topic: reference
ms.date: 11/01/2021

---

# Connecting cameras to the cloud using a transparent gateway



## Pre-reading
[Get started with Azure Video Analyzer in the Portal](../get-started-detect-motion-emit-events-portal.md)
[Connect camera to the cloud](connect-cameras-to-cloud.md#connecting-via-a-transparent gateway)

## Prerequisites
The following are required for this tutorial:

* An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have one.
* Azure Video Analyzer account with associated:
  * Storage account
  * User-assigned managed identity (UAMI)
* IoT Hub
  * Video Analyzer associated UAMI has **Owner** role
* [IoT Edge with Video Analyzer edge module installed and configured manually](../edge/deploy-iot-edge-device.md)
* [Azure Directory application with Owner access, service principal, and client secret](../../../active-directory/develop/howto-create-service-principal-portal.md)
  * Be sure to keep note of the values for the Tenant ID, App (Client) ID, and client secret.




## Ensure that camera(s) are on the same network as edge device

## Configure IoT device for camera

## Enable Video Analyzer edge module to act as transparent gateway

## Create Cloud topology and pipeline

## Run pipeline

## Playback in Portal

## Next Steps
Run cloud pipeline with RTSP source enabled with tunneling
