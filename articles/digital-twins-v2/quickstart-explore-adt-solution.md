---
# Mandatory fields.
title: 'Quickstart: Explore a Azure Digital Twin solution'
description: In this quickstart, you will build an existing Azure Digital Twin sample scenario and explore it to get data insights.
author: philmea
ms.author: philmea # Microsoft employees only
ms.date: 2/12/2020
ms.topic: quickstart
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---
# Explore an Azure Digital Twin solution

Intent: I want to quickly build an example ADT solution and transform telemetry into insights.​

Scenario: Monitor hygiene in a health facility ​

Tooling: Azure subscription, CLI*, VS Code, .NET core​

Experiences per tool​

    - CLI​  *preferred quickstart tooling

    - VS Code​

    - Visual Studio​

Outline: ​

    - Git clone project​

    - Create Azure AD service principal​

    - Modify project with SP / connection info​

    - Dotnet run​

    - Explore a simple model and graph, run an example query

## ADT: A Simple Example
In hospitals, it is crucial that medical personnel wash their hands regularly. However, actual compliance with hand-washing policies is traditionally hard to measure. Using IoT technology, a hospital aims to solve multiple business problems at once:
* Measure compliance with hand washing policies to control spread of germs
* Make sure that sanitation equipment and soap and towel dispensers are always filled and operational
* Reduce maintenance costs, by making sure that only sanitation equipment that needs maintenance is visited by facilities management for repair or refill
* Collect long term data about the aggregate behavior of medical personnel that can be used for research, with the goal of designing more effective policies that can protect patients and providers alike

The desired solution provides a dashboard that can display current and historical information for each patient room, as well as roll-ups for each ward in the hospital, each floor, and the hospital as a whole. A separate dashboard informs maintenance staff about device operability as well as requests for refills, etc.
From an IoT perspective, the solution is built around motion sensors that can detect and count people traffic into and out of patient rooms, as well as sensors that can check the fill status of soap and towel dispensers. The data collected by the sensors might also be correlated with scheduling information originating from a different business system.