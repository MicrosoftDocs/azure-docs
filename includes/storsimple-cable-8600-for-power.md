---
author: alkohli
ms.service: storsimple
ms.topic: include
ms.date: 10/26/2018
ms.author: alkohli
---

#### To cable your device for power
> [!NOTE]
> Both enclosures on your StorSimple device include redundant PCMs. For each enclosure, the PCMs must be installed and connected to different power sources to ensure high availability.
> 
> 

1. Make sure that the power switches on all the PCMs are in the OFF position.
2. On the primary enclosure, connect the power cords to both PCMs. The power cords are identified in red in the power cabling diagram, below.
3. Make sure that the two PCMs on the primary enclosure use separate power sources.
4. Attach the power cords to the power on the rack distribution units as shown in the power cabling diagram.
5. Repeat steps 2 through 4 for the EBOD enclosure.
6. Turn on the EBOD enclosure by flipping the power switch on each PCM to the ON position.
7. Verify that the EBOD enclosure is turned on by checking that the green LEDs on the back of the EBOD controller are turned ON.
8. Turn on the primary enclosure by flipping each PCM switch to the ON position.
9. Verify that the system is on by ensuring the device controller LEDs have turned ON.
10. Make sure that the connection between the EBOD controller and the device controller is active by verifying that the four LEDs next to the SAS port on the EBOD controller are green.
    
    > [!IMPORTANT]
    > To ensure high availability for your system, we recommend that you strictly adhere to the power cabling scheme shown in the following diagram.
    > 
    > 
    
    ![Cable your 4U device for power](./media/storsimple-cable-8600-for-power/HCSCableYour4UDeviceforPower.png)
    
    **Power cabling**
    
    | Label | Description |
    |:--- |:--- |
    | 1 |Primary enclosure |
    | 2 |PCM 0 |
    | 3 |PCM 1 |
    | 4 |Controller 0 |
    | 5 |Controller 1 |
    | 6 |EBOD controller 0 |
    | 7 |EBOD controller 1 |
    | 8 |EBOD enclosure |
    | 9 |PDUs |

