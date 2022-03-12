---

title: Application Insights CPU metrics
description: Defining CPU metrics for Application Insights
services: azure-monitor
ms.topic: conceptual
ms.date: 03/11/2022
ms.reviewer: vgorbenko

---

# CPU metrics

Application Insights displays two formats for CPU metrics, normalized and non-normalized. 
Non-normalized metrics are measured across CPU cores. For example, CPU utilization metrics on a 4-core VM range from 0 to 400 percent.
This explains why some CPU metrics display values greater than 100 percent. 

Normalized metrics display the standard percentage values of 0 through 100. These metrics format the non-normalized value by dividing it
with the number of CPU cores.


 


 
