---
title: Vehicle consumption models for routing | Microsoft Azure Maps
description: "Learn about the consumption models that Azure Maps supports: combustion and electric. See which parameters each model uses, and view parameter constraints." 
author: subbarayudukamma
ms.author: skamma
ms.date: 05/08/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
---


# Consumption model

The Routing service provides a set of parameters for a detailed description of the vehicle-specific Consumption Model.
Depending on the value of **vehicleEngineType**, two principal Consumption Models are supported: _Combustion_ and _Electric_. It's incorrect to specify parameters that belong to different models in the same request. Also, Consumption Model parameters can't be used with the following **travelMode** values: _bicycle_ and _pedestrian_.

## Parameter constraints for consumption model

In both Consumption Models, there are some dependencies when specifying parameters. Meaning that, explicitly specifying some parameters may require specifying some other parameters. Here are these dependencies to be aware of:

* All parameters require **constantSpeedConsumption** to be specified by the user. It's an error to specify any other consumption model parameter, if **constantSpeedConsumption** isn't specified. The **vehicleWeight** parameter is an exception for this requirement.
* **accelerationEfficiency** and **decelerationEfficiency** must always be specified as a pair (that is, both or none).
* If **accelerationEfficiency** and **decelerationEfficiency** are specified, product of their values must not be greater than 1 (to prevent perpetual motion).
* **uphillEfficiency** and **downhillEfficiency** must always be specified as a pair (that's, both or none).
* If **uphillEfficiency** and **downhillEfficiency** are specified, product of their values must not be greater than 1 (to prevent perpetual motion).
* If the \*__Efficiency__ parameters are specified by the user, then **vehicleWeight** must also be specified. When **vehicleEngineType** is _combustion_, **fuelEnergyDensityInMJoulesPerLiter** must be specified as well.
* **maxChargeInkWh** and **currentChargeInkWh** must always be specified as a pair (that is, both or none).

> [!NOTE]
> If only **constantSpeedConsumption** is specified, no other consumption aspects like slopes and vehicle acceleration are taken into account for consumption computations.

## Combustion consumption model

The Combustion Consumption Model is used when **vehicleEngineType** is set to _combustion_.
The following list of parameters belong to this model. Refer to the Parameters section for detailed description.

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
The following list of parameters belong to this model. Refer to the Parameters section for detailed description.

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

A particular set of consumption parameters can be rejected, even though the set might fulfill all the explicit requirements. It happens when the value of a specific parameter, or a combination of values of several parameters, is considered to lead to unreasonable magnitudes of consumption values. If that happens, it most likely indicates an input error, as proper care is taken to accommodate all sensible values of consumption parameters. In case a particular set of consumption parameters is rejected, the accompanying error message contains a textual explanation of the reason(s).
The detailed descriptions of the parameters have examples of sensible values for both models.
