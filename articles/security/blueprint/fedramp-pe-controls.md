---

title: Web Applications for FedRAMP: Physical and Environmental Protection
description: Web Applications for FedRAMP: Physical and Environmental Protection
services: security
documentationcenter: na
author: jomolesk
manager: mbaldwin
editor: tomsh

ms.assetid: 0bf8349b-450d-413c-a535-6f7b80b82781
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/15/2017
ms.author: jomolesk

---

> [!NOTE]
> These controls are defined by NIST and the U.S. Department of Commerce as part of the NIST Special Publication 800-53 Revision 4. Please refer to NIST 800-53 Rev. 4 for information on testing procedures and guidance for each control.
    
    

# Physical and Environmental Protection (PE)

## NIST 800-53 Control PE-1

#### Physical and Environmental Protection Policy and Procedures

**PE-1** The organization develops, documents, and disseminates to [Assignment: organization-defined personnel or roles] a physical and environmental protection policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination among organizational entities, and compliance; and procedures to facilitate the implementation of the physical and environmental protection policy and associated physical and environmental protection controls; and reviews and updates the current physical and environmental protection policy [Assignment: organization-defined frequency]; and physical and environmental protection procedures [Assignment: organization-defined frequency].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level physical and environmental protection policy and procedures may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control PE-2.a

#### Physical Access Authorizations

**PE-2.a** The organization develops, approves, and maintains a list of individuals with authorized access to the facility where the information system resides.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. Physical access to a Microsoft datacenter must be approved by the Datacenter Management (DCM) team using the datacenter access tool. Access assignments require an end date, after which access is automatically removed and must be reapproved. Additionally, when access is no longer required, datacenter security officers or management to manually request the termination of access. |


 ## NIST 800-53 Control PE-2.b

#### Physical Access Authorizations

**PE-2.b** The organization issues authorization credentials for facility access.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. The datacenter access tool is the authoritative source listing all personnel with authorized access to a specific datacenter. The tool is linked with the datacenter's physical security access control devices and authorizes access based on access levels that are approved by the DCM team. Access levels are assigned in the tool to either a user's Microsoft issued badge or a temporary access badge that is assigned at the datacenter by the Control Room Supervisor (CRS). Access levels are approved by the DCM team. In addition to credentials assigned to physical badges, some areas of the datacenter require enrollment of the user's biometric data (hand geometry or fingerprint). |


 ## NIST 800-53 Control PE-2.c

#### Physical Access Authorizations

**PE-2.c** The organization reviews the access list detailing authorized facility access by individuals [Assignment: organization-defined frequency].

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. In addition to the access revocation described in part a, Microsoft Azure reviews authorized access lists for Azure datacenters every 90 days in order to remove/update individual access as necessary. |


 ## NIST 800-53 Control PE-2.d

#### Physical Access Authorizations

**PE-2.d** The organization removes individuals from the facility access list when access is no longer required.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. Microsoft Azure removes access automatically when the access assignment end date is reached. When access is no longer required, datacenter security officers or management will manually request the termination of access in the datacenter access tool. Additionally, Microsoft Azure will remove any unneeded access authorizations discovered as a result of the access list review described in part c. |


 ## NIST 800-53 Control PE-3.a

#### Physical Access Control

**PE-3.a** The organization enforces physical access authorizations at [Assignment: organization-defined entry/exit points to the facility where the information system resides] by verifying individual access authorizations before granting access to the facility; and controlling ingress/egress to the facility using [Selection (one or more): [Assignment: organization-defined physical access control systems/devices]; guards].

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. Microsoft Azure enforces physical access authorizations for all physical access points to Azure datacenters using 24x7 staffing, alarms, video surveillance, multifactor authentication, and man-trap portal devices. |


 ## NIST 800-53 Control PE-3.b

#### Physical Access Control

**PE-3.b** The organization maintains physical access audit logs for [Assignment: organization-defined entry/exit points].

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. All accesses to Azure datacenter facilities are logged and audited. |


 ## NIST 800-53 Control PE-3.c

#### Physical Access Control

**PE-3.c** The organization provides [Assignment: organization-defined security safeguards] to control access to areas within the facility officially designated as publicly accessible.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. Azure datacenters do not contain areas that are designated as publicly accessible. |


 ## NIST 800-53 Control PE-3.d

#### Physical Access Control

**PE-3.d** The organization escorts visitors and monitors visitor activity [Assignment: organization-defined circumstances requiring visitor escorts and monitoring].

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. All visitors that have approved access to the datacenter (See PE-2) are designated as 'Escort Only' on their badges or through other visual cue (e.g., colored badges)and are required to remain with their escorts at all times. Escorted visitors do not have any access levels granted to them and can only travel on the access of their escorts. Escorts monitor all activities of their visitor while in the datacenter. |


 ## NIST 800-53 Control PE-3.e

#### Physical Access Control

**PE-3.e** The organization secures keys, combinations, and other physical access devices.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. Physical keys and temporary access badges are secured within the security operations center (SOC). Security officers are staffed 24x7. Keys are checked out to specific personnel by matching the person's access badge to the physical key. Key inventories are conducted during each shift and keys are not allowed to be taken offsite. |


 ## NIST 800-53 Control PE-3.f

#### Physical Access Control

**PE-3.f** The organization inventories [Assignment: organization-defined physical access devices] every [Assignment: organization-defined frequency].

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. Physical access devices within Azure datacenters are inventoried on at least an annual basis. Keys and temporary access badges are inventoried multiple times a day during each shift. Access badge readers and similar access devices are linked to the physical security system where status is continuously represented. |


 ## NIST 800-53 Control PE-3.g

#### Physical Access Control

**PE-3.g** The organization changes combinations and keys [Assignment: organization-defined frequency] and/or when keys are lost, combinations are compromised, or individuals are transferred or terminated.  

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. Microsoft Azure datacenters have procedures to implement in cases when an access badge or key is lost or a person is terminated or transferred. In the event of a termination or transfer, the person's access is immediately removed from the system and their access badge removed. |


 ### NIST 800-53 Control PE-3 (1)

#### Physical Access Control | Information System Access

**PE-3 (1)** The organization enforces physical access authorizations to the information system in addition to the physical access controls for the facility at [Assignment: organization-defined physical spaces containing one or more components of the information system].

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure further restricts areas within Microsoft datacenters that contain critical systems (e.g., colocations, critical environments, MDF rooms, etc.) through various security mechanisms such as electronic access control, biometric devices, and anti-passback controls. Access to Azure colocations are granted as a separate, higher level of DCAT access than other access areas of the datacenter. In addition, all Azure FTE's and vendors who have access to the Azure Government colocations are required to formally undergo Microsoft's Cloud Screening and US citizenship verification prior to being authorized access to the environment. See PS-03 section for further details regarding the cloud screening for the Azure Government colocations. |


 ## NIST 800-53 Control PE-4

#### Access Control for Transmission Medium

**PE-4** The organization controls physical access to [Assignment: organization-defined information system distribution and transmission lines] within organizational facilities using [Assignment: organization-defined security safeguards].

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. Microsoft Azure has implemented access control for transmission medium through the design and building of the Main Distribution Frame (MDF) rooms and colocations to protect information system distribution and transmission lines from accidental damage, disruption, and physical tampering. Access to MDF rooms and colocations require two factor authentication (access badge and biometrics). This ensures that access is restricted to only authorized personnel (See PE-2, PE-3). Within the MDF, transmission and distribution lines are protected from accidental damage, disruption, and physical tampering through the use of metal conduits, locked racks, cages, or cable trays. |


 ## NIST 800-53 Control PE-5

#### Access Control for Output Devices

**PE-5** The organization controls physical access to information system output devices to prevent unauthorized individuals from obtaining the output.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. Microsoft Azure datacenters do not have output devices (monitors, printers, audio devices, etc.) permanently connected to Azure assets or Azure shared assets. In addition to not having output devices, security officers perform physical walkthroughs of the facility multiple times per shift checking for items like doors being locked and racks being secured. Datacenter access is limited to people who have approved access authorizations. Colocations require two factor authentication (access badge and biometrics) to gain access. |


 ## NIST 800-53 Control PE-6.a

#### Monitoring Physical Access

**PE-6.a** The organization monitors physical access to the facility where the information system resides to detect and respond to physical security incidents.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. Physical access is monitored by implementing security devices and processes at the datacenters. Examples include 24x7 electronic monitoring of access control, alarm and video systems as well as 24x7 on site security patrols of the facility and grounds. A Control Room Supervisor is located in the SOC at all times to provide monitoring of physical access in the datacenter. |


 ## NIST 800-53 Control PE-6.b

#### Monitoring Physical Access

**PE-6.b** The organization reviews physical access logs [Assignment: organization-defined frequency] and upon occurrence of [Assignment: organization-defined events or potential indications of events].

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. Physical access logs are reviewed continuously, and maintained for subsequent investigative review. |


 ## NIST 800-53 Control PE-6.c

#### Monitoring Physical Access

**PE-6.c** The organization coordinates results of reviews and investigations with the organizational incident response capability. 

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. Security events that occur within the datacenter are documented by the security team. The security team creates reports that capture the details of a security event after the event occurs. <br /> For incidents requiring government notification, the Microsoft Azure security team will coordinate with the major application provider (e.g., O365) to notify the government agency customer, US CERT, and FedRAMP within US-CERT guidelines (see IR-6). |


 ### NIST 800-53 Control PE-6 (1)

#### Monitoring Physical Access | Intrusion Alarms / Surveillance Equipment

**PE-6 (1)** The organization monitors physical intrusion alarms and surveillance equipment.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. In addition to the 24x7 onsite security, Microsoft Azure datacenters (leased and fully managed) also utilize alarm monitoring systems and CCTV. Alarms are monitored and responded to by the Control Room Supervisor stationed 24x7 in the SOC. During a response situation, the Control Room Supervisor utilizes cameras in the area of the incident being investigated to give the responder real-time information. |


 ### NIST 800-53 Control PE-6 (4)

#### Monitoring Physical Access | Monitoring Physical Access to Information Systems

**PE-6 (4)** The organization monitors physical access to the information system in addition to the physical access monitoring of the facility as [Assignment: organization-defined physical spaces containing one or more components of the information system].

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure monitors physical access to the facilities as well as the information systems within the datacenters. All Microsoft's online services' equipment is placed in locations within datacenters where physical access is monitored. All of the colocation and MDF rooms are protected by access control, alarms, and video. |


 ## NIST 800-53 Control PE-8.a

#### Visitor Access Records

**PE-8.a** The organization maintains visitor access records to the facility where the information system resides for [Assignment: organization-defined time period].

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. Datacenter access records are maintained in the datacenter access tool in the form of approved requests. As described in PE-3, visitors are required to be escorted at all times. The escort's access within the datacenter is logged and if necessary can be correlated to the visitor for future review. |


 ## NIST 800-53 Control PE-8.b

#### Visitor Access Records

**PE-8.b** The organization reviews visitor access records [Assignment: organization-defined frequency].

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. Visitors with an approved access request will have their access record reviewed at the time their identification is verified against a form of government issued ID or Microsoft issued badge. As described in PE-3, visitors are escorted at all times while at the datacenter. |


 ### NIST 800-53 Control PE-8 (1)

#### Visitor Access Records | Automated Records Maintenance / Review

**PE-8 (1)** The organization employs automated mechanisms to facilitate the maintenance and review of visitor access records.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure maintains datacenter access records in DCAT in the form of approved DCAT requests. DCAT requests can only be approved by the DCM team. Access levels within the datacenter are assigned and managed within DCAT. Datacenter access is reviewed quarterly. All access to Azure datacenters is recorded in DCAT and is available for future possible investigations. Visitors are required to be escorted at all times. The escort's access within the datacenter is logged within the alarm monitoring system and if necessary can be correlated to the visitor for future review. Visitor access is being reviewed continuously by the assigned escort and by the control room supervisor via CCTV and the alarm monitoring system. Visitors are not provided with access and must be accompanied by their escorts at all times. |


 ## NIST 800-53 Control PE-9

#### Power Equipment and Cabling

**PE-9** The organization protects power equipment and power cabling for the information system from damage and destruction.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. Microsoft Azure provides protective spaces and appropriate labeling for cables. Microsoft Azure infrastructure equipment, for example, cables, electrical lines, and backup generators must be placed in environments which have been engineered to be protected from environmental risks such as theft, fire, explosives, smoke, water, dust, vibration, earthquake, harmful chemicals, electrical interference, power outages, electrical disturbances (spikes). All portable online services assets (e.g., racks, servers, network devices) must be locked or fastened in place in order to provide protection against theft or movement damage. Power and information system cables within any Microsoft Azure environment are labeled appropriately and protected against interception or damage. Power and information system cables are separated from each other at all points within an environment to avoid interference. |


 ## NIST 800-53 Control PE-10.a

#### Emergency Shutoff

**PE-10.a** The organization provides the capability of shutting off power to the information system or individual system components in emergency situations.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. Microsoft Azure has installed Emergency Power Off (EPO) buttons in locations within the datacenter as required by local fire code. In some Microsoft Azure managed datacenters, the datacenter design no longer requires EPO buttons. |


 ## NIST 800-53 Control PE-10.b

#### Emergency Shutoff

**PE-10.b** The organization places emergency shutoff switches or devices in [Assignment: organization-defined location by information system or system component] to facilitate safe and easy access for personnel.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. EPO buttons are strategically placed to allow for activation in emergency situations. EPO buttons can be placed in the colocations, manned Facilities Operation Centers (FOCs), or as required by local fire code. |


 ## NIST 800-53 Control PE-10.c

#### Emergency Shutoff

**PE-10.c** The organization protects emergency power shutoff capability from unauthorized activation.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. To prevent accidental activation, EPO buttons may have a protective enclosure, require dual activation, or utilize an audible alarm as a warning before activation. Additionally, EPO buttons are under video surveillance. |


 ## NIST 800-53 Control PE-11

#### Emergency Power

**PE-11** The organization provides a short-term uninterruptible power supply to facilitate [Selection (one or more): an orderly shutdown of the information system; transition of the information system to long-term alternate power] in the event of a primary power source loss.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. Microsoft Azure has implemented emergency power by protecting datacenter equipment and circuits with an uninterruptible power supply (UPS) system which provides a short-term power supply to provide power until generators are able to come online. |


 ### NIST 800-53 Control PE-11 (1)

#### Emergency Power | Long-Term Alternate Power Supply - Minimal Operational Capability

**PE-11 (1)** The organization provides a long-term alternate power supply for the information system that is capable of maintaining minimally required operational capability in the event of an extended loss of the primary power source.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure has implemented a long-term alternate power supply for the information system that is capable of maintaining a minimum required operational capability when an extended loss of the primary power source occurs. When power fails or drops to an unacceptable voltage level, Uninterruptable Power Supply (UPS) systems instantly kick in and take over the power load. This provides enough power for running the servers until the generators can take over. Emergency generators provide back-up power for extended outages and for planned maintenance, and can operate the data center with on-site fuel reserves in the event of a natural disaster. Azure maintains diesel generator at many of our datacenters. Backup generators are used when necessary to help maintain grid stability or in extraordinary repair, and maintenance situations that require us to take our datacenters off the power grid. |


 ## NIST 800-53 Control PE-12

#### Emergency Lighting

**PE-12** The organization employs and maintains automatic emergency lighting for the information system that activates in the event of a power outage or disruption and that covers emergency exits and evacuation routes within the facility.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. Microsoft Azure datacenters (leased and fully managed) implement emergency lighting in the form of overhead emergency lighting on dedicated circuits backed up by UPS and generator systems (See PE-11). Automatic emergency lighting is implemented along all evacuation routes, emergency exits, and inside the colocations in accordance with the National Fire and Protection Association (NFPA) Life Safety Code. In the event that utility power is lost, the emergency lighting will automatically switch to power provided by the UPS and generator systems. The emergency lighting systems within Microsoft Azure datacenters undergo routine maintenance to ensure that they remain in proper working order. |


 ## NIST 800-53 Control PE-13

#### Fire Protection

**PE-13** The organization employs and maintains fire suppression and detection devices/systems for the information system that are supported by an independent energy source.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. Microsoft Azure has implemented fire protection by installing fire detection and fire suppression systems at the Microsoft Azure datacenters. <br /> Microsoft Azure datacenters implement robust fire detection mechanisms. The Microsoft Azure fire protection approach includes the use of photoelectric smoke detectors installed below the floor and on the ceiling which are integrated with the fire protection sprinkler system. Additionally, there are Xtralis VESDA (Very Early Smoke Detection Apparatus) systems in each colocation which monitor the air. VESDA units are highly-sensitive air sampling systems installed throughout multiple high-value spaces. VESDA units allow for an investigative response prior to an actual fire detection alarm. <br /> 'Pull station' fire alarm boxes are installed throughout the datacenters for manual fire alarm notification. Fire extinguishers are located throughout the datacenters and are properly inspected, serviced, and tagged annually. The security staff patrols all building areas multiple times every shift. Datacenter personnel perform a daily site walk-through ensuring all fire watch requirements are being met. <br /> Areas containing sensitive electrical equipment (colocations, MDFs, etc.) are protected by double interlock pre-action (dry pipe) sprinkler systems. Dry pipe sprinklers are a two-stage pre-action system that requires both a sprinkler head activation (due to heat) as well as smoke detection to release water. The sprinkler head activation releases the air pressure in the pipes which allows the pipes to fill with water. Water is released when a smoke or heat detector is also activated. <br /> Fire detection/suppression and emergency lighting systems are wired into the datacenter UPS and generator systems providing for a redundant power source. |


 ### NIST 800-53 Control PE-13 (1)

#### Fire Protection | Detection Devices / Systems

**PE-13 (1)** The organization employs fire detection devices/systems for the information system that activate automatically and notify [Assignment: organization-defined personnel or roles] and [Assignment: organization-defined emergency responders] in the event of a fire.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure employs fire detection devices/systems for the information system that activate automatically and notify datacenter personnel along with emergency responders in the event of a fire. In the event that one of the fire detection mechanisms is activated in any colocation, the local fire department is automatically notified through the fire alarm system. In addition, the fire protection and fire detection systems are tied into the security system notifying the local facility and security staff. |


 ### NIST 800-53 Control PE-13 (2)

#### Fire Protection | Suppression Devices / Systems

**PE-13 (2)** The organization employs fire suppression devices/systems for the information system that provide automatic notification of any activation to [Assignment: organization-defined personnel or roles] and [Assignment: organization-defined emergency responders].

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. In the event that one of the fire suppression systems is activated at the datacenter, the local fire department is automatically notified through the fire alarm system. In addition, the fire protection and fire detection systems are tied into the security system notifying the local facility and security staff. |


 ### NIST 800-53 Control PE-13 (3)

#### Fire Protection | Automatic Fire Suppression

**PE-13 (3)** The organization employs an automatic fire suppression capability for the information system when the facility is not staffed on a continuous basis.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. Microsoft Azure datacenters are staffed 24x7. Fire suppression systems engage automatically without manual intervention when a fire alarm situation is detected. |


 ## NIST 800-53 Control PE-14.a

#### Temperature and Humidity Controls

**PE-14.a** The organization maintains temperature and humidity levels within the facility where the information system resides at [Assignment: organization-defined acceptable levels].

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. Microsoft Azure maintains the temperature and humidity levels in accordance with American Society of Heating, Refrigerating and Air-conditioning Engineers (ASHRAE) guidelines. The temperature and humidity levels are monitored continuously by the datacenter's Building Management System (BMS). |


 ## NIST 800-53 Control PE-14.b

#### Temperature and Humidity Controls

**PE-14.b** The organization monitors temperature and humidity levels [Assignment: organization-defined frequency].

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. At Microsoft Azure datacenters, temperature and humidity levels are monitored continuously by the Building Management System (BMS). Datacenter personnel monitor the BMS from the Facilities Operations Center (FOC), so that they can manage the temperature and humidity within the datacenter before any alarm points are exceeded. |


 ### NIST 800-53 Control PE-14 (2)

#### Temperature and Humidity Controls | Monitoring With Alarms / Notifications

**PE-14 (2)** The organization employs temperature and humidity monitoring that provides an alarm or notification of changes potentially harmful to personnel or equipment.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. At Microsoft Azure datacenters, temperature and humidity levels are monitored continuously by the Building Management System (BMS). Datacenter personnel monitor the BMS from the Facilities Operations Center (FOC), so that they can manage the temperature and humidity within the datacenter before any alarm points are exceeded. |


 ## NIST 800-53 Control PE-15

#### Water Damage Protection

**PE-15** The organization protects the information system from damage resulting from water leakage by providing master shutoff or isolation valves that are accessible, working properly, and known to key personnel.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. Microsoft Azure provides water/leak detection in areas with a risk of water leakage (e.g., Air Handlers Units). Fire suppression systems also have leak detection alarms that are monitored. The water/leak detection system is integrated with the facility alarm and notification system. The sprinkler systems in the datacenters are zoned. Datacenter personnel are familiar with emergency procedures requiring the use of the water shutoff valves and their locations. The sprinkler risers have the ability to be shut off individually or as a group via gate valves. All sprinklers in the critical space are double interlock pre-action type sprinklers that require two forms of activation before flow is initiated. The pressure of the sprinkler system is monitored and alarmed against water leakage. |


 ### NIST 800-53 Control PE-15 (1)

#### Water Damage Protection | Automation Support

**PE-15 (1)** The organization employs automated mechanisms to detect the presence of water in the vicinity of the information system and alerts [Assignment: organization-defined personnel or roles].

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure employs automated mechanisms to detect water presence in the datacenters and alerts datacenter personnel. Azure provides water/leak detection in areas with a risk of water leakage (e.g., Air Handlers Units). Fire suppression systems also have leak detection alarms that are monitored. The water/leak detection system is integrated with the facility alarm and notification system. The pressure of the sprinkler system is monitored and alarmed against water leakage. |


 ## NIST 800-53 Control PE-16

#### Delivery and Removal

**PE-16** The organization authorizes, monitors, and controls [Assignment: organization-defined types of information system components] entering and exiting the facility and maintains records of those items.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure implements this requirement on behalf of customers. Microsoft Azure implements strict enforcement of what is allowed to enter and exit the datacenter. All system components/assets are tracked in the asset management tool database. |


 ## NIST 800-53 Control PE-17.a

#### Alternate Work Site

**PE-17.a** The organization employs [Assignment: organization-defined security controls] at alternate work sites.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level alternate work site provisions may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control PE-17.b

#### Alternate Work Site

**PE-17.b** The organization assesses as feasible, the effectiveness of security controls at alternate work sites.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level alternate work site provisions may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control PE-17.c

#### Alternate Work Site

**PE-17.c** The organization provides a means for employees to communicate with information security personnel in case of security incidents or problems.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level alternate work site provisions may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control PE-18

#### Location of Information System Components

**PE-18** The organization positions information system components within the facility to minimize potential damage from [Assignment: organization-defined physical and environmental hazards] and to minimize the opportunity for unauthorized access.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Azure implements strategic datacenter design approach to satisfy the location of information system components control. All Microsoft's online services' equipment is placed in locations which have been engineered to be protected from environmental risks such as theft, fire, explosives, smoke, water, dust, vibration, earthquake, harmful chemicals, electrical interference, power outages, electrical disturbances (spikes), and radiation. The facility and infrastructure have implemented seismic bracing for protection against environmental hazards. All of the colocation and MDF rooms are protected by access control, alarms, and video. The facility is also patrolled by security officers 24x7. All portable Azure assets are locked or fastened in place in order to provide protection against theft or movement damage. |


