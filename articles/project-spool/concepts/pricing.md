---
title: Pricing
description: TODO
author: mikben    
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-project-spool

---

# Pricing
Azure Communication Services consumption plan is billed based on per-minute of VOIP Calls and per GB for any Data Transfer on the Relays, regardless of which SDK is used to establish the call. If there is no activity on your service, there will be no charges. 


## VOIP 

|Call Type | Public Preview | Rate |  
|-|:----------------:| :----------------:| 
| 1:1 no TR | Pay-as-you-go  |  Free |
| 1:1 w/TR |   Pay-as-you-go |  Based on MB used  |
| 1:N no TR |  Pay-as-you-go | Minutes per Participant |
| 1:N w/TR |  Pay-as-you-go| Minutes per Participant + MB used  |

##Estimating billing for VOIP

[Case 1: VoIP where a direct connection between two devices is possible ](https://github.com/mikben/azure-docs-pr/blob/release-project-spool/articles/project-spool/concepts/voice/call-flows.md#case-1-voip-where-a-direct-connection-between-two-devices-is-possible)

UserA makes a call to UserB who were on the same network for 2 hours. 
Total: 120 * $TBD = $0.xxx


[Case 2: VoIP where a direct connection between devices is not possible, but where connection between NAT devices is possible](https://review.docs.microsoft.com/en-us/azure/project-spool/concepts/voice/call-flows?branch=pr-en-us-104477#case-2-voip-where-a-direct-connection-between-devices-is-not-possible-but-where-connection-between-nat-devices-is-possible)

UserA makes a VOP call to userB who are in seperate cities for 1 hour
Total: (60 * $TBD) + (54MB * $TBD)

Average relay usage for Audio only:
Average relay usage for Screen Share:



[Case 3: VoIP where neither a direct nor NAT connection is possible](https://review.docs.microsoft.com/en-us/azure/project-spool/concepts/voice/call-flows?branch=pr-en-us-104477#case-3-voip-where-neither-a-direct-nor-nat-connection-is-possible)





## Chat

| Chat Type | Public Preview | Rate |  
|-|:----------------:| :----------------:| 
| 1:1 | Pay-As-You-Go  |  Per Msg's sent |
| 1:N |  Pay-As-You-Go |  TBD |
| Android | Public Preview | TBD |

## Transport Relay

| | Public Preview | Rate |  
|-|:----------------:| :----------------:| 
| Relay Usage | Pay-As-You-Go  |  Per MB sent  |

## PSTN

[Case 4: Group calls with PSTN](https://review.docs.microsoft.com/en-us/azure/project-spool/concepts/voice/call-flows?branch=pr-en-us-104477#case-4-group-calls-with-pstn)

## SMS 

### meta

- Looks like other resources point to a /pricing page that is managed by Commerce or Marketing? https://azure.microsoft.com/en-us/pricing/details/functions/

-  Customer intent statements: 
   - I want to know what the pricing model for ACS looks like.

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
