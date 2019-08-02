---
 title: include file
 description: include file
 services: virtual-machines
 author: ayshakeen
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 08/01/2019
 ms.author: azcspmt;ayshak;cynthn
 ms.custom: include file
---


## Reserved instances

I already bought 1 or 3-year RI for D15_v2 or DS15_v2, how can I use that?
All RIs purchased before the announcement date (tentative: 8/15) will get following behavior by default. 


| RI     | Autofit | Which size gets the benefit.                                                 |
|--------|---------|------------------------------------------------------------------------------|
| D15_v2 | Off     | D15_v2, D15i_v2                                                              |
| D15_v2 | On      | D15_v2 family will get the RI benefit. D15i_v2 will also get the RI benefit. |
|        |         |                                                                              |
| D14_v2 | On      | Dv2 family will get the RI benefit. D15i_v2 will also get the RI benefit.    |

Likewise for DS15_v2.  

All RIs purchased after the announcement date will get the following behavior by default: 

| RI                                                                     | Autofit | Which size gets the benefit.                     |
|------------------------------------------------------------------------|---------|--------------------------------------------------|
| D15_v2                                                                 | Off     | D15_v2                                           |
| D15_v2                                                                 | On      | D15_v2 hardware family  will get the RI benefit. |
|                                                                        |         | D15i_v2 will not get the RI benefit. Since this is a separate hardware.                                                  |
|     |         |                                                  |
| D15i_v2                                                                | Off     | D15i_v2                                          |
| D15i_v2                                                                | On      | D15i_v2                                          |
|                                                                        |         | Autofit does not apply to any other sizes such as D2_v2, D4_v2 D15_v2.                                                |


Can I buy a 3-year RI for D15i_v2 and DS15i_v2?
Unfortunately no, only 1 year RI is available for purchase
 
Can I move my already bought RI from D15_v2/DS15_v2 to another isolated size?
You can only use the already bought RI of D15_v2/DS15_v2 for D15i_v2/DS15i_v2. For rest of the sizes you need buy separate RIs.