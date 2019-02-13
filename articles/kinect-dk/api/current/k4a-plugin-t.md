---
title: k4a_plugin_t structure
description: Plugin API which must be populated on plugin registration. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, structure
---
# k4a_plugin_t structure

Plugin API which must be populated on plugin registration. 

## Syntax

```C
typedef struct {
    k4a_plugin_version_t version;
    k4a_de_create_and_initialize_fn_t depth_engine_create_and_initialize;
    k4a_de_process_frame_fn_t depth_engine_process_frame;
    k4a_de_get_output_frame_size_fn_t depth_engine_get_output_frame_size;
    k4a_de_destroy_fn_t depth_engine_destroy;
} k4a_plugin_t;
```

## Remarks
The K4A SDK will call k4a_register_plugin, and pass in a pointer to a 
[k4a_plugin_t](~/api/current/k4a-plugin-t.md)
. The plugin must properly fill out all fields of the plugin for the K4A SDK to accept the plugin.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4aplugin.h (include k4a/k4aplugin.h) 


## Members

[`k4a_plugin_version_t`](~/api/current/k4a-plugin-version-t.md) `version`

Version this plugin was written against. 

[`k4a_de_create_and_initialize_fn_t`](~/api/current/k4a-de-create-and-initialize-fn-t.md) `depth_engine_create_and_initialize`

function pointer to a depth_engine_create_and_initialize function 

[`k4a_de_process_frame_fn_t`](~/api/current/k4a-de-process-frame-fn-t.md) `depth_engine_process_frame`

function pointer to a depth_engine_process_frame function 

[`k4a_de_get_output_frame_size_fn_t`](~/api/current/k4a-de-get-output-frame-size-fn-t.md) `depth_engine_get_output_frame_size`

function pointer to a depth_engine_get_output_frame_size function 

[`k4a_de_destroy_fn_t`](~/api/current/k4a-de-destroy-fn-t.md) `depth_engine_destroy`

function pointer to a depth_engine_destroy function 

