---
title: Enable browser access to lab virtual machines
description: Learn how to connect to your virtual machines through a browser.
ms.topic: how-to
ms.date: 10/29/2021
---

# Connect to your lab virtual machines through a browser 

DevTest Labs integrates with [Azure Bastion](../bastion/index.yml), which enables you to connect to your lab virtual machines (VM) through a browser. Once **Browser connect** is enabled, lab users can access their virtual machines through a browser.  

In this how-to guide, you'll connect to a lab VM using **Browser connect**.

## Prerequisites

- A lab VM, with a [Bastion-configured virtual network and the **Browser connect** setting turned on](enable-browser-connection-lab-virtual-machines.md).

- A web browser configured to allow pop-ups from `https://portal.azure.com:443`.

## Launch virtual machine in a browser

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your lab in **DevTest Labs**.

1. Select a virtual machine.

1. From the top menu, select **Browser connect**.

1. In the **Browser connect** section, enter your credentials and then select **Connect**.

    :::image type="content" source="./media/connect-virtual-machine-through-browser/lab-vm-browser-connect.png" alt-text="Screenshot of browser connect button.":::

## Next Steps

[Add a VM to a lab in Azure DevTest Labs](devtest-lab-add-vm.md)
