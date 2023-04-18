---
title: "Troubleshoot CLI parsing failures"
titleSuffix: Azure Digital Twins
description: Learn how to diagnose and resolve parsing failures with the Azure Digital Twins CLI command set.
ms.service: digital-twins
author: baanders
ms.author: baanders
ms.topic: troubleshooting
ms.date: 03/31/2022
---

# Troubleshoot parsing failures with Azure Digital Twins CLI commands

This article describes causes and resolution steps for various "parse failed" errors while running [az dt](/cli/azure/dt) commands in the Azure CLI.

## Symptoms

While attempting to run select `az dt` commands in an Azure CLI environment, you receive an error indicating that the command wasn't parsed correctly. The error message might include the words *parse failed* or *failed to parse*, or partial text from your command may be marked as *unrecognized arguments.*

## Causes

### Cause #1

Some `az dt` commands use special characters that have to be escaped for proper parsing in certain shell environments. It is possible that some special character in your CLI command needs to be escaped for it to be parsed in the shell that you're using.

## Solutions

### Solution #1

Use the full error message text to help you determine which character is causing an issue. Then, try escaping instances of this character with a backslash or a backtick. For a list of some specific characters that need to be escaped in certain shells, see [Use special characters in different shells](concepts-cli.md#use-special-characters-in-different-shells).

### Solution #2

If you're encountering the parsing issue while passing inline JSON into a command (like [az dt model create](/cli/azure/dt/model#az-dt-model-create) or [az dt twin create](/cli/azure/dt/twin#az-dt-twin-create)), check whether the command allows you to pass in a file instead. Many of the commands that support inline JSON also support input as a file path, which can help you avoid shell-specific text requirements.

### Solution #3

Not all shells have the same special character requirements, so you can try running the command in a different shell type (some options are the [Cloud Shell](https://shell.azure.com) Bash environment, [Cloud Shell](https://shell.azure.com) PowerShell environment, local Windows CMD, local Bash window, or local PowerShell window).

## Next steps

Read more about the CLI for Azure Digital Twins:
* [Azure Digital Twins CLI command set](concepts-cli.md)
* [az dt command reference](/cli/azure/dt)
