---
title: Connecting camera to cloud using a transparent gateway
description: This article explains how to connect a camera to Azure Video Analyzer using a transparent gateway. 
ms.topic: reference
ms.date: 11/01/2021

---

# Connecting cameras to the cloud using a transparent gateway



## Pre-reading
[Connect camera to the cloud](connect-cameras-to-cloud.md#connecting-via-a-transparent gateway)

## Prerequisites
The following are required for this tutorial:

* An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have one.
* Azure Video Analyzer account with associated:
  * Storage account
  * User-assigned managed identity
* IoT Hub
* [IoT Edge device registered with IoT Hub](../../../iot-edge/how-to-register-device.md)
* [Azure Directory application with Owner access, service principal, and client secret](../../../active-directory/develop/howto-create-service-principal-portal.md)
  * Be sure to keep note of the values for the Tenant ID, App (Client) ID, and client secret.

## Connect Video Analyzer account to IoT Hub

## Deploy IoT Edge Module

## Configure IoT device for camera

## Enable Video Analyzer edge module to act as transparent gateway

## Next Steps
Run cloud pipeline with RTSP source enabled with tunneling
