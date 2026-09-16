---
title: Migrate to type-safe serialization in Durable Functions for Python
titleSuffix: Azure Functions
description: Learn how to adopt type-safe (type-aware) payload serialization in an existing Durable Functions app that uses the Python programming model.
author: andystaples
ms.author: azfuncdf
ms.reviewer: azfuncdf
ms.topic: how-to
ms.service: azure-functions
ms.date: 07/09/2026
ms.devlang: python
ms.custom: devx-track-python
#Customer intent: As a Python Durable Functions developer, I want to adopt type-safe serialization so that my custom-object payloads are validated against the expected type and my app is protected from untrusted-payload deserialization.
---

# Migrate to type-safe serialization in Durable Functions for Python

This article shows you how to adopt *type-safe* (also called *type-aware*) payload serialization in an existing [Durable Functions](durable-functions-overview.md) app that uses the Python programming model. Type-safe serialization validates deserialized payloads against an expected type and lets you opt in to a hardened *strict mode* that removes an untrusted-payload deserialization risk.

Adopting type-safe serialization is a recommended best practice for every Durable Functions app that uses Python, including apps that aren't security sensitive. It helps you catch type-mismatch bugs early, because the SDK validates each payload against the type your code expects instead of silently reconstructing whatever type the stored data names. Strict mode additionally hardens your app against untrusted-payload deserialization, which makes your code more secure. The `azure-functions` SDK advertises strict mode as a best practice, and this article walks you through adopting it incrementally, starting with backward-compatible steps.

The feature is delivered across two packages that work together:

- **`azure-functions`** provides the centralized serializers (`df_dumps` / `df_loads`) with optional type validation and strict-typing support.
- **`azure-functions-durable`** routes all Durable Functions payload serialization through those serializers and adds the `expected_type` parameter and automatic type discovery to the orchestration and entity APIs.

For background on what data Durable Functions persists and how custom types are serialized, see [Data persistence and serialization in Durable Functions](durable-functions-serialization-and-persistence.md).

## What changes

Before this feature, Durable Functions deserialized custom-object payloads by reading the `__module__` and `__class__` fields embedded in the stored JSON and calling `importlib.import_module()` to locate the class. There was no check that the class in the payload matched the type your code expected.

Type-safe serialization adds:

- An optional `expected_type` argument on the orchestration and entity APIs that deserialize a payload.
- **Automatic type discovery** that reads the return-type annotation of your v2-decorated activity and sub-orchestrator functions and uses it as the `expected_type` without any code change.
- A **strict mode**, opted in with the `AZURE_FUNCTIONS_DURABLE_STRICT_TYPING` environment variable, that turns type mismatches into hard errors and deserializes custom objects without calling `importlib.import_module()`.

The [serialization format is unchanged](durable-functions-serialization-and-persistence.md). Built-in types still serialize to plain JSON, and custom objects still use the `{"__class__", "__module__", "__data__"}` convention. This means loose mode is fully backward compatible: existing histories and in-flight orchestrations continue to deserialize as before.

## Prerequisites

- An existing Durable Functions app that uses the Python programming model (v1 or v2).
- The following minimum package versions, which ship the centralized `df_dumps` / `df_loads` serializers:

  | Python version | Minimum `azure-functions` version |
  | --- | --- |
  | 3.13 and later | 2.2.0 |
  | 3.10 – 3.12 | 1.26.0 |

- `azure-functions-durable` 1.6.0 or later.

> [!NOTE]
> If the installed `azure-functions` package doesn't provide `df_dumps` / `df_loads`, Durable Functions falls back to the legacy serialization pipeline. The persisted JSON format stays the same, but the `expected_type` argument and strict mode have no effect. Upgrade to the versions in the preceding table to enable type-validated serialization.

## Loose mode compared to strict mode

Type-safe serialization has two modes.

| Behavior | Loose mode (default) | Strict mode |
| --- | --- | --- |
| Opt in | Always on | Set `AZURE_FUNCTIONS_DURABLE_STRICT_TYPING` to `1`, `true`, or `yes` |
| Type mismatch | Logs a warning, then falls back to the legacy decoder | Raises `TypeError` |
| Custom-object decode | Uses `importlib.import_module()` (legacy path) | Calls `expected_type.from_json()` directly; never calls `import_module` |
| `to_json` / `from_json` contract | Unchanged | Must be symmetric and produce natively JSON-serializable data (see [Update to_json and from_json](#step-3-update-to_json-and-from_json-for-strict-mode)) |
| Backward compatible | Yes | No. Requires code changes |

Loose mode is safe to adopt immediately because it never changes behavior for correctly typed payloads. Strict mode is a deliberate, security-hardening change that requires the migration steps that follow.

## Migrate incrementally

Adopt type-safe serialization in phases. Steps 1 and 2 are backward compatible and safe to ship on their own. Complete steps 3 and 4 only when you're ready to enable strict mode.

### Step 1: Upgrade the packages

Update your app's requirements to the minimum versions in [Prerequisites](#prerequisites). For example, in *requirements.txt*:

```text
azure-functions>=2.2.0
azure-functions-durable>=1.6.0
```

After you upgrade, your app continues to run in loose mode with no behavior change. You don't need to make any other changes to keep your existing app working.

### Step 2: Adopt loose-mode type validation

In loose mode, provide the expected type so the SDK can validate deserialized payloads and log a warning on any mismatch. You can supply the type in three ways and mix them as needed.

**Add return-type annotations to activities and sub-orchestrators.** In the Python v2 programming model, the SDK discovers the return annotation automatically and uses it to validate the result. No call-site change is needed.

```python
@myApp.activity_trigger(input_name="city")
def get_weather(city: str) -> WeatherReport:
    return WeatherReport(city=city, temperature_c=21)


@myApp.orchestration_trigger(context_name="context")
def orchestrator(context: df.DurableOrchestrationContext):
    # The WeatherReport return annotation on get_weather is discovered
    # automatically and used to validate the result.
    report = yield context.call_activity("get_weather", "Seattle")
    return report.temperature_c
```

**Pass `expected_type` explicitly.** An explicit `expected_type` takes precedence over a discovered annotation. Use it when the return type isn't a concrete class. For example, generic aliases such as `list[Order]` or `Optional[Order]` can't be discovered automatically.

```python
orders = yield context.call_activity("get_orders", customer_id, expected_type=list)
```

The `expected_type` argument is available on these orchestration APIs:

- `call_activity` and `call_activity_with_retry`
- `call_sub_orchestrator` and `call_sub_orchestrator_with_retry`
- `call_entity`
- `wait_for_external_event`
- `get_input`

And on these entity APIs, through `DurableEntityContext`:

- `get_state`
- `get_input`

**Declare the orchestration input type on the trigger.** Use the `input_type` argument on `orchestration_trigger` so that `context.get_input()` validates the input. A call-site `expected_type` on `get_input()` takes precedence.

```python
@myApp.orchestration_trigger(context_name="context", input_type=OrderRequest)
def orchestrator(context: df.DurableOrchestrationContext):
    request = context.get_input()  # validated against OrderRequest
    ...
```

After this step, run your app and watch the logs for type-mismatch warnings under the `azure.functions.DurableFunctions` logger. Resolve any warnings before you move on to strict mode. Because this step only adds warnings, it's safe to deploy on its own.

> [!TIP]
> Automatic type discovery resolves only concrete `type` objects. Generic aliases such as `list[Order]`, `dict[str, Order]`, and `Optional[Order]` resolve to "no type information," and decoding falls back to module-only resolution. Supply `expected_type` explicitly when you need validation for these shapes.

### Step 3: Update to_json and from_json for strict mode

Strict mode changes the contract for custom types. In strict mode, `to_json()` must return a value that `json.dumps` can serialize natively, such as dicts, lists, strings, numbers, booleans, or `None`. You must explicitly serialize nested custom objects instead of returning them as instances, and `from_json()` must reconstruct them symmetrically.

This requirement removes `__module__` strings from stored payloads at every nesting level, so deserialization no longer needs to resolve type names from payload data.

```python
class Order:
    def __init__(self, item, hat):
        self.item = item
        self.hat = hat

    @staticmethod
    def to_json(obj):
        return {
            "item": obj.item,
            "hat": Hat.to_json(obj.hat),   # explicit, not obj.hat
        }

    @staticmethod
    def from_json(data):
        return Order(
            item=data["item"],
            hat=Hat.from_json(data["hat"]),  # symmetric
        )
```

**Handle in-flight legacy payloads during rollout.** If your app might still read payloads that were written in loose mode before the upgrade, make `from_json` tolerate both shapes. A loose-encoded nested value arrives as an already-reconstructed instance (the legacy `object_hook` fires), while a strict-encoded value arrives as a plain dict.

```python
    @staticmethod
    def from_json(data):
        hat_data = data["hat"]
        if isinstance(hat_data, Hat):
            hat = hat_data                 # loose-encoded: object already built
        else:
            hat = Hat.from_json(hat_data)  # strict-encoded: plain dict
        return Order(item=data["item"], hat=hat)
```

### Step 4: Enable strict mode

Set the `AZURE_FUNCTIONS_DURABLE_STRICT_TYPING` application setting to `1`, `true`, or `yes` (case-insensitive).

In your local *local.settings.json*:

```json
{
  "Values": {
    "AZURE_FUNCTIONS_DURABLE_STRICT_TYPING": "true"
  }
}
```

Or as an application setting on your function app:

```azurecli
az functionapp config appsettings set --name <APP_NAME> --resource-group <RESOURCE_GROUP> --settings AZURE_FUNCTIONS_DURABLE_STRICT_TYPING=true
```

In strict mode:

- Type mismatches raise `TypeError` instead of logging a warning.
- Custom objects are deserialized by calling `expected_type.from_json()` directly, so `import_module` is never used.
- Any call site that deserializes a custom object *without* an `expected_type` raises `TypeError`. Make sure every such call site supplies a type through one of the mechanisms in [Step 2](#step-2-adopt-loose-mode-type-validation) before you enable strict mode.
- Activity function *inputs* can't be custom objects. See the following note.

> [!IMPORTANT]
> In strict mode, an activity function's *input* can't be a custom object. When the host invokes an activity, the `azure-functions` activity trigger converter deserializes the input without an `expected_type`, because the Functions worker doesn't forward the activity's parameter type annotation to the converter. A custom-object input therefore fails with a `ValueError`. Pass activity inputs as natively JSON-serializable values instead, such as dictionaries, lists, strings, numbers, booleans, or `None`. If you need to send a custom object, convert it with its `to_json()` method before the call and reconstruct it with `from_json()` inside the activity. This limitation applies only to activity inputs. Activity return values, orchestration and entity inputs, entity state, and external event payloads all support custom types in strict mode when you supply a type.

> [!IMPORTANT]
> Enable strict mode only after all app instances are upgraded and any in-flight orchestrations that carry loose-encoded histories are drained or your `from_json` methods tolerate both shapes ([Step 3](#step-3-update-to_json-and-from_json-for-strict-mode)). An orchestration that started before the upgrade replays its original, loose-encoded history. If your code can't decode that history under strict mode, replay fails.

### Versioning implications for existing orchestrations

Updating to type-safe serialization breaks running orchestrations if the payload types change from the legacy implementation. Each time an orchestration continues, it replays its stored history. If a decode site now expects a type that doesn't match what an older payload stored, strict mode raises a `TypeError` that wasn't present when the history was first written, and that new error breaks the orchestration. Two common migration changes introduce this mismatch:

- **A path that previously carried more than one type.** If a single deserialization path, such as an activity result, could previously return different object types, and you now annotate it with a single `expected_type`, a stored payload that used a different type no longer matches and fails to decode.
- **Custom types used as activity inputs.** Because [activity inputs can't be custom objects in strict mode](#step-4-enable-strict-mode), adopting strict mode requires you to change those inputs to JSON-serializable values, which changes the payload shape that running instances persisted.

More generally, any change that makes a payload's stored type differ from the type a decode site now expects causes the same error. For example, renaming or moving a custom class after its instances are persisted introduces the same mismatch.

To migrate safely, use one of these approaches:

- **Recommended: split the rollout with orchestration versioning.** Use [orchestration versioning](../common/durable-orchestration-versioning.md) with the `Strict` version-matching strategy so that your new strict-mode workers process only the orchestrations that started on the new version. This best practice lets both versions coexist during a [rolling upgrade](durable-functions-zero-downtime-deployment.md) and avoids replay failures.
- **Alternative: drain first.** Let all in-flight orchestrations finish, then enable strict mode.

Before you enable strict mode in production, confirm that every custom-object decode site supplies a type and that your custom classes keep the same name and module they had when running instances persisted their payloads.

For broader guidance on safely deploying changes that affect running orchestrations, see [Versioning in Durable Functions](durable-functions-versioning.md).

## Security hardening

Strict mode strengthens how custom-object payloads are deserialized. Instead of trusting the module and class names embedded in a stored or inbound payload to locate a type, strict mode reconstructs custom objects using the `expected_type` that your code supplies, and strict-mode `to_json()` output doesn't persist module names at any nesting level. This change removes the need to resolve arbitrary type names from payload data during deserialization, which is a defense-in-depth improvement over relying on the type information carried in the payload.

If your payloads can contain sensitive data, also review [Work with sensitive data](durable-functions-serialization-and-persistence.md#work-with-sensitive-data).

## Related content

- [Data persistence and serialization in Durable Functions](durable-functions-serialization-and-persistence.md)
- [Durable Functions bindings](durable-functions-bindings.md)
- [Durable Functions overview](durable-functions-overview.md)
