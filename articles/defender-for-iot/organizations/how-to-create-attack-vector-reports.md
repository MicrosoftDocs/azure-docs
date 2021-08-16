---
title: Create attack vector reports
description: Attack vector reports provide a graphical representation of a vulnerability chain of exploitable devices.
ms.date: 12/17/2020
ms.topic: how-to
---

# Attack vector reporting

## About attack vector reports

Attack vector reports provide a graphical representation of a vulnerability chain of exploitable devices. These vulnerabilities can give an attacker access to key network devices. The Attack Vector Simulator calculates attack vectors in real time and analyzes all attack vectors for a specific target.

Working with the attack vector lets you evaluate the effect of mitigation activities in the attack sequence. You can then determine, for example, if a system upgrade disrupts the attacker's path by breaking the attack chain, or if an alternate attack path remains. This information helps you prioritize remediation and mitigation activities.

:::image type="content" source="media/how-to-generate-reports/control-center.png" alt-text="View your alerts in the control center.":::

> [!NOTE]
> Administrators and security analysts can perform the procedures described in this section.

## Create an attack vector report

To create an attack vector simulation:

1. Select :::image type="content" source="media/how-to-generate-reports/plus.png" alt-text="Plus sign":::on the side menu to add a Simulation.

 :::image type="content" source="media/how-to-generate-reports/vector.png" alt-text="The attack vector simulation.":::

2. Enter simulation properties:

   - **Name**: Simulation name.

   - **Maximum vectors**: The maximum number of vectors in a single simulation.

   - **Show in Device map**: Show the attack vector as a filter on the device map.

   - **All Source devices**: The attack vector will consider all devices as an attack source.

   - **Attack Source**: The attack vector will consider only the specified devices as an attack source.

   - **All Target devices**: The attack vector will consider all devices as an attack target.

   - **Attack Target**: The attack vector will consider only the specified devices as an attack target.

   - **Exclude devices**: Specified devices will be excluded from the attack vector simulation.

   - **Exclude Subnets**: Specified subnets will be excluded from the attack vector simulation.

3. Select **Add Simulation**. The simulation will be added to the simulations list.

   :::image type="content" source="media/how-to-generate-reports/new-simulation.png" alt-text="Add a new simulation.":::

4. Select :::image type="icon" source="media/how-to-generate-reports/edit-a-simulation-icon.png" border="false"::: if you want to edit the simulation.

   Select :::image type="icon" source="media/how-to-generate-reports/delete-simulation-icon.png" border="false"::: if you want to delete the simulation.

   Select :::image type="icon" source="media/how-to-generate-reports/make-a-favorite-icon.png" border="false"::: if you want to mark the simulation as a favorite.

5. A list of attack vectors appears and includes vector score (out of 100), attack source device, and attack target device. Select a specific attack for graphical depiction of attack vectors.

   :::image type="content" source="media/how-to-generate-reports/sample-attack-vectors.png" alt-text="Attack vectors.":::

## See also

[Attack vector reporting](how-to-create-attack-vector-reports.md)


