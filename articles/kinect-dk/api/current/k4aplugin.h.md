---
title: k4aplugin.h file
description: Kinect For Azure Depth Engine Plugin API. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, file
---
# k4aplugin.h file

Kinect For Azure Depth Engine Plugin API. 

## Syntax

Defines the API which must be defined by the depth engine plugin to be used by the K4A SDK. 

## Definitions

|  Title | Description |
|--------|-------------|
| [__stdcall](~/api/current/-stdcall.md) | __stdcall not defined in Linux  |
| [K4A_PLUGIN_DYNAMIC_LIBRARY_NAME](~/api/current/K4A-PLUGIN-DYNAMIC-LIBRARY-NAME.md) | Expected name of plugin's dynamic library.  |
| [K4A_PLUGIN_EXPORTED_FUNCTION](~/api/current/K4A-PLUGIN-EXPORTED-FUNCTION.md) | Name of the function all plugins must export in a dynamic library.  |
| [K4A_PLUGIN_MAJOR_VERSION](~/api/current/K4A-PLUGIN-MAJOR-VERSION.md) | Current Version of the k4a Depth Engine Plugin API.  |
| [K4A_PLUGIN_MINOR_VERSION](~/api/current/K4A-PLUGIN-MINOR-VERSION.md) | K4A plugin minor version.  |
| [K4A_PLUGIN_PATCH_VERSION](~/api/current/K4A-PLUGIN-PATCH-VERSION.md) | K4A plugin patch version.  |

## Typedefs

|  Title | Description |
|--------|-------------|
| [k4a_de_create_and_initialize_fn_t](~/api/current/k4a-de-create-and-initialize-fn-t.md) | Function for creating and initialzing the depth engine.  |
| [k4a_de_destroy_fn_t](~/api/current/k4a-de-destroy-fn-t.md) | Destroys the depth engine context.  |
| [k4a_de_get_output_frame_size_fn_t](~/api/current/k4a-de-get-output-frame-size-fn-t.md) | Get the size of the output frame in bytes.  |
| [k4a_de_process_frame_fn_t](~/api/current/k4a-de-process-frame-fn-t.md) | Function to process depth frame.  |
| [k4a_depth_engine_context_t](~/api/current/k4a-depth-engine-context-t.md) | Opaque struct to be implemented by plugin.  |
| [k4a_processing_complete_cb_t](~/api/current/k4a-processing-complete-cb-t.md) | callback function for depth engine finishing processing  |
| [k4a_register_plugin_fn](~/api/current/k4a-register-plugin-fn.md) | Function signature for  [K4A_PLUGIN_EXPORTED_FUNCTION](~/api/current/K4A-PLUGIN-EXPORTED-FUNCTION.md) .  |

## Enumerations

|  Title | Description |
|--------|-------------|
| [k4a_depth_engine_input_type_t](~/api/current/k4a-depth-engine-input-type-t.md) | Depth Engine valid input formats.  |
| [k4a_depth_engine_mode_t](~/api/current/k4a-depth-engine-mode-t.md) | Valid Depth Engine modes.  |
| [k4a_depth_engine_output_type_t](~/api/current/k4a-depth-engine-output-type-t.md) | Depth Engine output formats.  |
| [k4a_depth_engine_result_code_t](~/api/current/k4a-depth-engine-result-code-t.md) | Depth Engine Result codes.  |

