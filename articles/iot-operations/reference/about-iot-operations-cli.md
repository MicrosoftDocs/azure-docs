---
title: About Azure IoT Operations CLI
# titleSuffix: Azure IoT Operations
description: Learn about the Azure IoT Operations CLI.
author: PatAltimore
ms.author: patricka
ms.topic: reference
ms.date: 11/02/2023

# CustomerIntent: As an IT admin or operator, I want to learn about the Azure IoT Operations CLI so that I can manage my IoT deployments.
---

# Azure IoT Operations CLI

Some kind of intro.

## Login

Run `az login` and follow the prompts for standard interactive login.

The following commands **require** `az login`

- `az iot ops init`

## K8s cluster

To maintain minimum friction between k8s tools, the `az iot ops` k8s side commands are designed to make use of your existing kubeconfig (typically located at `~/.kube/config`).

All k8s interaction commands include an optional `--context` param. If none is provided `current_context` as defined in the kube config will be used.

The init command requires k8s cluster access for the CSI driver and TLS config workflows.

The following commands **do not** require `az login`

- `az iot ops check`
- `az iot ops mq stats`
- `az iot ops support create-bundle`

## Configure subscription

Use `az account` commands to manage your default tenant and subscriptions.

Use `az account show` to see what the current default is and `az account list` to iterate all subscriptions/tenants you have access to.

Use `az account set -s <sub id>` to set your default.

## Commands

Remember `--help` and `--debug` are your friends.

Ensure your desired subscription is activated as default by running `az account set --subscription '<sub Id>'`

The provided commands are meant as a starting point to get you going faster. In many cases commands include various options, switches and modes to support advanced usage scenarios.
