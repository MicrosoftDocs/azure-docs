---
title: Consumption Model in Azure Maps | Microsoft Docs
description: Learn about consumption model in Azure Maps 
author: subbarayudukamma
ms.author: skamma
ms.date: 05/08/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
---


# Consumption model

Online Routing provides a set of parameters for a detailed description of vehicle-specific Consumption Model.
Depending on the value of **vehicleEngineType**, two principal Consumption Models are supported: _Combustion_ and _Electric_. Specifying parameters that belong to different models in the same request is an error.
Consumption Model cannot be used with **travelMode** values _bicycle_ and _pedestrian_.

## Parameter constraints for consumption model

In both Consumption Models, explicitly specifying some parameters requires specifying some others as well. These dependencies are:

* All parameters require **constantSpeedConsumption** to be specified by the user. It is an error to specify any other consumption model parameter, with the exception of **vehicleWeight**, if **constantSpeedConsumption** is not specified.
* **accelerationEfficiency** and **decelerationEfficiency** must always be specified as a pair (i.e. both or none).
* If **accelerationEfficiency** and **decelerationEfficiency** are specified, product of their values must not be greater than 1 (to prevent perpetual motion).
* **uphillEfficiency** and **downhillEfficiency** must always be specified as a pair (i.e. both or none).
* If **uphillEfficiency** and **downhillEfficiency** are specified, product of their values must not be greater than 1 (to prevent perpetual motion).
* If the \*__Efficiency__ parameters are specified by the user, then **vehicleWeight** must also be specified. When **vehicleEngineType** is _combustion_, **fuelEnergyDensityInMJoulesPerLiter** must be specified as well.
* **maxChargeInkWh** and **currentChargeInkWh** must always be specified as a pair (i.e. both or none).

> [!NOTE]
> If only **constantSpeedConsumption** is specified, no other consumption aspects like slopes and vehicle acceleration are taken into account for consumption computations.

## Combustion consumption model

The Combustion Consumption Model is used when **vehicleEngineType** is set to _combustion_.
The list of parameters that belong to this model are below. Refer to the Parameters section for detailed description.

* constantSpeedConsumptionInLitersPerHundredkm
* vehicleWeight
* currentFuelInLiters
* auxiliaryPowerInLitersPerHour
* fuelEnergyDensityInMJoulesPerLiter
* accelerationEfficiency
* decelerationEfficiency
* uphillEfficiency
* downhillEfficiency

## Electric consumption model

The Electric Consumption Model is used when **vehicleEngineType** is set to _electric_.
The list of parameters that belong to this model are below. Refer to the Parameters section for detailed description.

* constantSpeedConsumptionInkWhPerHundredkm
* vehicleWeight
* currentChargeInkWh
* maxChargeInkWh
* auxiliaryPowerInkW
* accelerationEfficiency
* decelerationEfficiency
* uphillEfficiency
* downhillEfficiency

## Sensible values of consumption parameters

A particular set of consumption parameters can be rejected, even though it might fulfill all the explicit requirements specified above. It happens when the value of a specific parameter, or a combination of values of several parameters, is deemed to lead to unreasonable magnitudes of consumption values. If that happens, it most likely indicates an input error, as proper care is taken to accommodate all sensible values of consumption parameters. In case a particular set of consumption parameters is rejected, the accompanying error message will contain a textual explanation of the reason(s).
The detailed descriptions of the parameters have examples of sensible values for both models.
