---
title: Create attack vector reports
description: Attack vector reports provide a graphical representation of a vulnerability chain of exploitable devices.
ms.date: 02/03/2022
ms.topic: how-to
---

# Attack vector reporting

## About attack vector reports

Attack vector reports provide a graphical representation of a vulnerability chain of exploitable devices. These vulnerabilities can give an attacker access to key network devices. The Attack Vector Simulator calculates attack vectors in real time and analyzes all attack vectors for a specific target.

Working with the attack vector lets you evaluate the effect of mitigation activities in the attack sequence. You can then determine, for example, if a system upgrade disrupts the attacker's path by breaking the attack chain, or if an alternate attack path remains. This information helps you prioritize remediation and mitigation activities.

> [!NOTE]
> Administrators and security analysts can perform the procedures described in this section.

## Create an attack vector report

This section describes how to create Attack Vector reports.

**To create an attack vector simulation:**

1. Select **Attack vector** from the sensor side menu. 
1. Select **Add simulation**.

2. Enter simulation properties:

   - **Name**: Simulation name.

   - **Maximum vectors**: The maximum number of vectors in a single simulation.

   - **Show in Device map**: Show the attack vector as a group in the Device map.

   - **All Source devices**: The attack vector will consider all devices as an attack source.

   - **Attack Source**: The attack vector will consider only the specified devices as an attack source.

   - **All Target devices**: The attack vector will consider all devices as an attack target.

   - **Attack Target**: The attack vector will consider only the specified devices as an attack target.

   - **Exclude devices**: Specified devices will be excluded from the attack vector simulation.

   - **Exclude Subnets**: Specified subnets will be excluded from the attack vector simulation.

3. Select **Save**.
1. Select the report that is saved from the Attack vector page and review:
    - network attack paths and insights
    - a risk score
    - source and target devices
    -  a graphical representation of attack vectors

   :::image type="content" source="media/how-to-generate-reports/sample-attack-vectors.png" alt-text="Screen shot of Attack vectors report.":::


## Next steps

For more information, see [Attack vector reporting](how-to-create-attack-vector-reports.md).
