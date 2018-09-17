---
title: Managing Alert & Smart Group States
description: Managing the states of the alert and smart group instances
author: anantr
services: monitoring
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: anantr
ms.component: alerts
---


# Overview
This article shows you how to use the Alert States/Smart Group States to manage your workflow.
## Changing the state of an alert
You can change the state of an alert in the following different ways: 
1. In the All Alerts page, click the checkbox next to the alerts you wish to change the state of, and click change state.   
    ![Monitoring](./media/monitoring-alerts-managing-alert-states/state-all-alerts.jpg)
1. In the Alert Details page for a particular alert instance, you can click change state   
    ![Monitoring](./media/monitoring-alerts-managing-alert-states/state-alert-details.jpg)
1. In the Alert Details page for a specific alert instance, in the Smart Group pane you can click the checkbox next to the alerts you wish    
    ![Monitoring](./media/monitoring-alerts-managing-alert-states/state-alert-details-sg.jpg)

1. In the Smart Group Details page, in the list of member alerts you can click the checkbox next to the alerts you wish to change the state of and click Change Stateto change the state of and click Change State.   
    ![Monitoring](./media/monitoring-alerts-managing-alert-states/state-sg-details-alerts.jpg)
1.	On clicking Change State, a popup opens up allowing you to select the state (New/Acknowledged/Closed) and enter a comment if necessary.   
![Monitoring](./media/monitoring-alerts-managing-alert-states/state-alert-change.jpg)
1.	Once this is done, the state change is recorded in the history of the respective alert. This can be viewed by opening the respective Details page, and checking the history section.

## Changing the state of a smart group
1. You can change the state of a smart group in the following different ways:
    1. In the Smart Group list page, you can click the checkbox next to the smart groups you wish to change the state of and click Change State  
    ![Monitoring](./media/monitoring-alerts-managing-alert-states/state-sg-list.jpg)
    1. In the Smart Group Details page, you can click change state        
    ![Monitoring](./media/monitoring-alerts-managing-alert-states/state-sg-details.jpg)
1. On clicking Change State, a popup opens up allowing you to select the state (New/Acknowledged/Closed) and enter a comment if necessary. **Note:** Changing the state of a smart group does not change the state of the member alerts.
![Monitoring](./media/monitoring-alerts-managing-alert-states/state-sg-change.jpg)
1. Once this is done, the state change is recorded in the history of the respective smart group. This can be viewed by opening the respective Details page, and checking the history section.
