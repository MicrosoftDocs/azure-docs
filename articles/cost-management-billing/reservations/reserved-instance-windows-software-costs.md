---
title: Reservations software costs for Azure
description: Learn which software meters are not included in Azure Reserved VM Instance costs.
author: bandersmsft
ms.reviewer: nitinarora
tags: billing
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: conceptual
ms.date: 12/06/2022
ms.author: banders
---

# Software costs not included with Azure Reserved VM Instances

Virtual machine reserved instance and SQL reserved capacity discounts apply only to the infrastructure costs and not to the software costs. If you use Windows VM and don't have an Azure Hybrid Benefit on your reserved virtual machine instances, then you are charged for the software meters listed in the following section. For SQL PaaS deployments, the IP cost will continue to be charged using separate meter if Azure Hybrid Benefit is not selected.

## Windows software meters not included in reservation cost

| MeterId | MeterName in usage file | Used by VM |
| ------- | ------------------------| --- |
| e7e152ac-f29c-4cce-ad6e-026192c01ef2 | Reservation-Windows Svr Burst (1 Core) | B Series |
| cac255a2-9f0f-4c62-8bd6-f0fa449c5f76 | Reservation-Windows Svr Burst (2 Core) | B Series |
| 09756b58-3fb5-4390-976d-9ddd14f9ed18 | Reservation-Windows Svr Burst (4 Core) | B Series |
| e828cb37-5920-4dc7-b30f-664e4dbcb6c7 | Reservation-Windows Svr Burst (8 Core) | B Series |
| f65a06cf-c9c3-47a2-8104-f17a8542215a | Reservation-Windows Svr (1 Core) | All except B Series |
| b99d40ae-41fe-4d1d-842b-56d72f3d15ee | Reservation-Windows Svr (2 Core) | All except B Series |
| 1cb88381-0905-4843-9ba2-7914066aabe5 | Reservation-Windows Svr (4 Core) | All except B Series |
| 07d9e10d-3e3e-4672-ac30-87f58ec4b00a | Reservation-Windows Svr (6 Core) | All except B Series |
| 603f58d1-1e96-460b-a933-ce3775ac7e2e | Reservation-Windows Svr (8 Core) | All except B Series |
| 36aaadda-da86-484a-b465-c8b5ab292d71 | Reservation-Windows Svr (12 Core) | All except B Series |
| 02968a6b-1654-4495-ada6-13f378ba7172 | Reservation-Windows Svr (16 Core) | All except B Series |
| 175434d8-75f9-474b-9906-5d151b6bed84 | Reservation-Windows Svr (20 Core) | All except B Series |
| 77eb6dd0-88f5-4a16-ab39-05d1742efb25 | Reservation-Windows Svr (24 Core) | All except B Series |
| 0d5bdf46-b719-4b1f-a780-b9bdfffd0591 | Reservation-Windows Svr (32 Core) | All except B Series |
| f1214b5c-cc16-445f-be6c-a3bb75f8395a | Reservation-Windows Svr (40 Core) | All except B Series |
| 637b7c77-65ad-4486-9cc7-dc7b3e9a8731 | Reservation-Windows Svr (64 Core) | All except B Series |
| da612742-e7cc-4ca3-9334-0fb7234059cd | Reservation-Windows Svr (72 Core) | All except B Series |
| a485cb8c-069b-4cf3-9a8e-ddd84b323da2 | Reservation-Windows Svr (128 Core) | All except B Series |
| 904c5c71-1eb7-43a6-961c-d305a9681624 | Reservation-Windows Svr (256 Core) | All except B Series |
| 6fdab81b-4284-4df9-8939-c237cc7462fe | Reservation-Windows Svr (96 Core) | All except B Series |

## Cloud services software meters not included in reservation cost

| MeterId | MeterName in usage file |
| ------- | ------------------------|
|ac9d47ff-ff68-4afc-a145-0c321cf8d0d5|Cloud Services 1 vCPU License|
|e0434559-19ee-4132-9c46-05ad4044f3f7|Cloud Services 2 vCPU License|
|6ecc834e-39b3-48b3-8d10-cc5626bacb66|Cloud Services 4 vCPU License|
|13103090-ca72-4825-ab12-7f16c4931d95|Cloud Services 8 vCPU License|
|ecd2bb6e-45a5-49aa-a58b-3947ba21c364|Cloud Services 16 vCPU License|
|de2c7f1d-06dc-4b16-bc8b-c2ec5f4c8aee|Cloud Services 20 vCPU License|
|ca1af837-4b35-47f5-8d14-b1988149c4ca|Cloud Services 32 vCPU License|
|dc72ee45-2ab7-4698-b435-e2cf10d1f9f6|Cloud Services 64 vCPU License|
|7a803026-244c-4659-834c-11e6b2d6b76f|Cloud Services 80 vCPU License|

## Get rates for Azure meters

You can get the cost of each of the meters with the Azure Retail Prices API. For information on how to get the rates for an Azure meter, see [Azure Retail Prices overview](/rest/api/cost-management/retail-prices/azure-retail-prices).

## Next steps
To learn more about reservations for Azure, see the following articles:

- [What are reservations for Azure?](save-compute-costs-reservations.md)
- [Prepay for Virtual Machines with Azure Reserved VM Instances](../../virtual-machines/prepay-reserved-vm-instances.md)
- [Manage reservations for Azure](manage-reserved-vm-instance.md)
- [Understand how the reservation discount is applied](../manage/understand-vm-reservation-charges.md)
- [Understand reservation usage for your Pay-As-You-Go subscription](understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)

## Need help? Contact us

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).