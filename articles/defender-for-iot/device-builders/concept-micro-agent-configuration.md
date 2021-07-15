---
title: Micro agent configurations (Preview)
description: The collector sends all current data immediately after any configuration change is made. The changes are then applied.
ms.date: 07/15/2021
ms.topic: conceptual
---

# Micro agent configurations (Preview)

This article describes the different types of configurations that the micro agent support. Customers have the ability to configure the micro agent to fit the needs of their devices, and network environments.  

The micro agent configuration is controlled by a set of customizable module twin properties that can be adjusted to control the behavior of the agent. 

You can configure the agent to the settings that best suit your needs. For example, you can automatically exclude some events, or to minimize power consumption.

Immediately after changing any configurations, the collector will send the data. After the data is sent, the changes will be applied,and all the collectors will restart. 

## Event based collectors configurations 

These configurations include process, and network activity collectors.

| Process name | Setting option | Description | Default setting |
| -- | -- | -- | -- |
| **Priority** | High, Medium, or Low | Define frequency of sending | Medium |
| **Aggregation mode** | True, or False | indicate whether to process event aggregation for an identical event  | True |
| **Cache size** | cycle FIFO | The number of events collected in between sends | 256 |
| **Enable/Disable collector** | Enable, or Disable | Whether or not the collector is operational. | Enable |

## Trigger based collectors configurations 

These configurations include system information, and baseline collectors.

| Process name | Setting option | Description | Default setting |
| -- | -- | -- | -- |
| **Interval** | High, Medium, or Low | frequency of sending | Low |
 **Enable/Disable collector** | Enable, or Disable | Whether or not the collector is operational. | Enable |

## General configuration 

Define the frequency in which messages are sent for each priority level. The default values are listed below:

| Frequency | Time period (in minutes) |
| -- | -- | 
| Low | 1440 (24 hour) |
| Medium | 120 (2 hours) |
| High | 30 (.5 hours) |

To reduce the amount of messages sent to cloud, each priority should be set as a multiple of the one below it. For example, High: 60 minutes, Medium: 120 minutes, Low: 480 minutes.
