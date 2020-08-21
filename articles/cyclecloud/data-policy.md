---
title: Data Usage Policy
description: Read about data usage policy. See how telemetry data is collected and used within Azure CycleCloud. Learn how to opt out of data collection.
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---

# Data Usage Policy

The Azure CycleCloud tool collects anonymized usage data by default and sends this telemetry data to Microsoft. Microsoft may use this data to understand how users interact with CycleCloud to support and improve the CycleCloud product. The data is anonymized and does not include any personally or organizationally identifying data. The collected data is governed by the [Microsoft Privacy Policy](https://aka.ms/privacy). You may opt out of sending the usage data to Microsoft by following the instructions below.

## Data Collected

A summary of the usage data that is collected.

### Common Properties

* Application Version: current CycleCloud version
* Client OS: installation OS
* Site ID: Anonymized and unique ID each install 
* Node Id: Anonymized and unique ID for each install host
* Site Name: Site name of the install host

### Usage Properties

* Provider ID: Azure subscription ID
* Region: Azure region
* Machine Type: Azure VM Size 
* Cluster Id: Anonymized and unique ID for each cluster
* Usage metrics

### System Data

* CPU performance metrics
* Memory performance metrics
* Data performance metrics

### Diagnostic Data

* Exceptions and stack traces
* Web requests

## Opt Out of Collection

You can disable usage data collection if you would prefer to not send telemetry data to Microsoft. To disable:

1. Open CycleCloud in your browser
2. Click on “Settings” in the sidebar
3. Click on the “Advanced” tab
4. In the search bar, search for “telemetry”
5. Double-click on the setting named “telemetry.reporting.enabled”
6. Uncheck the “send telemetry data” option and “Save”

> [!WARNING]
> Disabling usage collection may impact CycleCloud’s ability to generate usage reports or to perform usage audits.
