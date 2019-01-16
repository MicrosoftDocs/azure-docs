---
title: Experimentation - Custom Decision Service
titlesuffix: Azure Cognitive Services
description: This article is a guide for experimentation with Custom Decision Service.
services: cognitive-services
author: marco-rossi29
manager: cgronlun

ms.service: cognitive-services
ms.component: custom-decision-service
ms.topic: conceptual
ms.date: 05/10/2018
ms.author: marossi
---

# Experimentation

Following the theory of [contextual bandits (CB)](https://www.microsoft.com/en-us/research/blog/contextual-bandit-breakthrough-enables-deeper-personalization/), Custom Decision Service repeatedly observes a context, takes an action, and observes a reward for the chosen action. An example is content personalization: the context describes a user, actions are candidate stories, and the reward measures how much the user liked the recommended story.

Custom Decision Service produces a policy, as it maps from contexts to actions. With a specific target policy, you want to know its expected reward. One way to estimate the reward is to use a policy online and let it choose actions (for example, recommend stories to users). However, such online evaluation can be costly for two reasons:

* It exposes users to an untested, experimental policy.
* It doesn't scale to evaluating multiple target policies.

Off-policy evaluation is an alternative paradigm. If you have logs from an existing online system that follow a logging policy, off-policy evaluation can estimate the expected rewards of new target policies.

By using the log file, Experimentation seeks to find the policy with the highest estimated, expected reward. Target policies are parameterized by [Vowpal Wabbit](https://github.com/JohnLangford/vowpal_wabbit/wiki) arguments. In the default mode, the script tests a variety of Vowpal Wabbit arguments by appending to the `--base_command`. The script performs the following actions:

* Auto-detects features namespaces from the first `--auto_lines` lines of the input file.
* Performs a first sweep over hyper-parameters (`learning rate`, `L1 regularization`, and `power_t`).
* Tests policy evaluation `--cb_type` (inverse propensity score (`ips`) or doubly robust (`dr`). For more information, see [Contextual Bandit example](https://github.com/JohnLangford/vowpal_wabbit/wiki/Contextual-Bandit-Example).
* Tests marginals.
* Tests quadratic interaction features:
   * **brute-force phase**: Tests all combinations with `--q_bruteforce_terms` pairs or fewer.
   * **greedy phase**: Adds the best pair until there is no improvement for `--q_greedy_stop` rounds.
* Performs a second sweep over hyper-parameters (`learning rate`, `L1 regularization`, and `power_t`).

The parameters that control these steps include some Vowpal Wabbit arguments:
- Example Manipulation options:
  - shared namespaces
  - action namespaces
  - marginal namespaces
  - quadratic features
- Update Rule options
  - learning rate
  - L1 regularization
  - t power value

For an in-depth explanation of the above arguments, see [Vowpal Wabbit command-line arguments](https://github.com/JohnLangford/vowpal_wabbit/wiki/Command-line-arguments).

## Prerequisites
- Vowpal Wabbit: Installed and on your path.
  - Windows: [Use the `.msi` installer](https://github.com/eisber/vowpal_wabbit/releases).
  - Other platforms: [Get the source code](https://github.com/JohnLangford/vowpal_wabbit/releases).
- Python 3: Installed and on your path.
- NumPy: Use the package manager of your choice.
- The *Microsoft/mwt-ds* repository: [Clone the repo](https://github.com/Microsoft/mwt-ds).
- Decision Service JSON log file: By default, the base command includes `--dsjson`, which enables Decision Service JSON parsing of the input data file. [Get an example of this format](https://github.com/JohnLangford/vowpal_wabbit/blob/master/test/train-sets/decisionservice.json).

## Usage
Go to `mwt-ds/DataScience` and run `Experimentation.py` with the relevant arguments, as detailed in the following code:

```cmd
python Experimentation.py [-h] -f FILE_PATH [-b BASE_COMMAND] [-p N_PROC]
                          [-s SHARED_NAMESPACES] [-a ACTION_NAMESPACES]
                          [-m MARGINAL_NAMESPACES] [--auto_lines AUTO_LINES]
                          [--only_hp] [-l LR_MIN_MAX_STEPS]
                          [-r REG_MIN_MAX_STEPS] [-t PT_MIN_MAX_STEPS]
                          [--q_bruteforce_terms Q_BRUTEFORCE_TERMS]
                          [--q_greedy_stop Q_GREEDY_STOP]
```

A log of the results is appended to the  *mwt-ds/DataScience/experiments.csv* file.

### Parameters
| Input | Description | Default |
| --- | --- | --- |
| `-h`, `--help` | Show help message and exit. | |
| `-f FILE_PATH`, `--file_path FILE_PATH` | Data file path (`.json` or `.json.gz` format - each line is a `dsjson`). | Required |  
| `-b BASE_COMMAND`, `--base_command BASE_COMMAND` | Base Vowpal Wabbit command.  | `vw --cb_adf --dsjson -c` |  
| `-p N_PROC`, `--n_proc N_PROC` | Number of parallel processes to use. | Logical processors |  
| `-s SHARED_NAMESPACES, --shared_namespaces SHARED_NAMESPACES` | Shared feature namespaces (for example, `abc` means namespaces `a`, `b`, and `c`).  | Auto-detect from data file |  
| `-a ACTION_NAMESPACES, --action_namespaces ACTION_NAMESPACES` | Action feature namespaces. | Auto-detect from data file |  
| `-m MARGINAL_NAMESPACES, --marginal_namespaces MARGINAL_NAMESPACES` | Marginal feature namespaces. | Auto-detect from data file |  
| `--auto_lines AUTO_LINES` | Number of data file lines to scan to auto-detect features namespaces. | `100` |  
| `--only_hp` | Sweep only over hyper-parameters (`learning rate`, `L1 regularization`, and `power_t`). | `False` |  
| `-l LR_MIN_MAX_STEPS`, `--lr_min_max_steps LR_MIN_MAX_STEPS` | Learning rate range as positive values `min,max,steps`. | `1e-5,0.5,4` |  
| `-r REG_MIN_MAX_STEPS`, `--reg_min_max_steps REG_MIN_MAX_STEPS` | L1 regularization range as positive values `min,max,steps`. | `1e-9,0.1,5` |  
| `-t PT_MIN_MAX_STEPS`, `--pt_min_max_steps PT_MIN_MAX_STEPS` | Power_t range as positive values `min,max,step`. | `1e-9,0.5,5` |  
| `--q_bruteforce_terms Q_BRUTEFORCE_TERMS` | Number of quadratic pairs to test in brute-force phase. | `2` |  
| `--q_greedy_stop Q_GREEDY_STOP` | Rounds without improvements, after which quadratic greedy search phase is halted. | `3` |  

### Examples
To use the preset default values:
```cmd
python Experimentation.py -f D:\multiworld\data.json
```

Equivalently, Vowpal Wabbit can also ingest `.json.gz` files:
```cmd
python Experimentation.py -f D:\multiworld\data.json.gz
```

To sweep only over hyper-parameters (`learning rate`, `L1 regularization`, and `power_t`, stopping after step 2):
```cmd
python Experimentation.py -f D:\multiworld\data.json --only_hp
```
