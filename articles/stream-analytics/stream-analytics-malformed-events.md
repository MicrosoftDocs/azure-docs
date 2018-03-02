---
title: Troubleshoot for malformed input events in Azure Stream Analytics| Microsoft Docs
description: How do I know which event in my input data is causing issue in a Stream Analytics job
keywords: ''
documentationcenter: ''
services: stream-analytics
author: SnehaGunda
manager: Kfile

ms.assetid: 
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 02/19/2018
ms.author: sngun
---

# Troubleshoot for malformed input events

When the input stream of your Stream Analytics job contains malformed messages, it causes serialization issues. Malformed messages include incorrect serialization such as missing parenthesis in a JSON object or incorrect time stamp format. When a Stream Analytics job receives a malformed message, it drops the message and notifies user with a warning. A warning symbol is shown on the **Inputs** tile of your Stream Analytics job:

![Inputs tile](media/stream-analytics-malformed-events/inputs_tile.png)

## Troubleshooting steps

1. Navigate to the input tile and click to view warnings.
2. The input details tile displays a set of warnings with details about the issue. Following is an example warning message, the warning message shows the Partition, Offset, and sequence numbers where there is malformed JSON data. 

   ![Warning message with offset](media/stream-analytics-malformed-events/warning_message_with_offset.png)

3. To get the JSON data that has incorrect format, run the following code snippet. This code block reads the partition Id, offset, and prints the data. You can get the full sample from the [GitHub samples repository](https://github.com/Azure/azure-stream-analytics/tree/master/Samples/CheckMalformedEventsEH). Once you read the data, you can analyze and correct the serialization format.

```csharp
static void PrintMessages(string partitionId, long offset, int numberOfEvents)
        {
            EventHubReceiver receiver;
            
            try
            {
                foreach (var e in receiver.Receive(numberOfEvents, TimeSpan.FromMinutes(1)))
                {
                    Console.WriteLine(Encoding.UTF8.GetString(e.GetBytes()));
                    Console.WriteLine("----");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return;
            }

            receiver.Close();
        }
```
## Next steps

* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
