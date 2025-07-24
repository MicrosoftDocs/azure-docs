---
author: stevenmatthew
ms.service: azure-databox
ms.topic: include
ms.date: 07/24/2025
ms.author: shaas
---

> [!IMPORTANT]
- Data Box Next Gen 120 TB and 525 TB devices use QSFP28 cables. For in house testing, the Q28-PC01 100G DAC QSFP28 Passive Direct Attach Copper Twinax cable was used. <br>
- SFP+/SFP28 cables used with the original 80 TB devices can't be inserted directly into Data Box Next Gen devices without an appropriate adapter. Recommended QSFP to SFP+ adaptors are Mellanox MAM1Q00A-QSA or Cisco 100G QSFP28. <br>
- To connect a QSFP28 device to an LC fiber backend using the Mellanox MAM1Q00A-QSA adapter or another compatible adapter, you need:
  - Mellanox MAM1Q00A-QSA Adapter – Converts the QSFP28 port to an SFP+ or SFP28 slot.
  - Compatible SFP+ or SFP28 Transceiver – Choose an optical transceiver that matches your LC fiber backbone (for example, SFP+ SR for multimode fiber or SFP+ LR for single-mode fiber).
  - LC Fiber Cable – Connects the transceiver to your fiber backbone.  
> :::image type="content" source="media/data-box-cable-adapter/qsfp-sml.png" alt-text="Image highlighting the differences between the SFP+, SFP28, and QSFP28 cables." lightbox="media/data-box-cable-adapter/qsfp-lrg.png":::
