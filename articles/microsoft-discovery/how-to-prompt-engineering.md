---
title: Write effective prompts for agents in Microsoft Discovery
description: Learn how to write agent instructions and user prompts for Microsoft Discovery agents to get accurate, well-structured responses for scientific research tasks.
author: leijgao
ms.author: leijiagao
ms.service: azure
ms.topic: how-to
ms.date: 04/16/2026

#CustomerIntent: As a researcher or scientist, I want to write effective prompts for my Discovery agents so that I can get accurate, reliable, and well-structured outputs for scientific workflows.
---

# Write effective prompts for agents in Microsoft Discovery

Prompt engineering is the practice of writing clear instructions that guide a large language model (LLM) to produce the output you need. In Microsoft Discovery, you write prompts in two places: agent instructions that define the agent's behavior, and user prompts that you type during investigations.

This article covers techniques for both instruction authoring and user prompt construction. All examples focus on scientific research scenarios relevant to Discovery workflows.

## Prerequisites

- An active [Azure subscription](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A deployed Microsoft Discovery workspace with at least one project. For setup instructions, see [Get started with Microsoft Discovery infrastructure](quickstart-infrastructure-portal.md).
- At least one prompt agent created in your project. For details, see [Create agents in Microsoft Discovery](how-to-agent-creation.md).
- Familiarity with [agent types in Microsoft Discovery](concept-discovery-agent-types.md).

## Understand the two prompt surfaces

Discovery agents use two prompt surfaces that work together.

**Agent instructions** define the agent's role, behavior, and constraints. You write them when you create or edit a prompt agent in Discovery Studio. Instructions act as the persistent system-level guidance for every conversation.

**User prompts** are the messages you type during an investigation. They provide the specific task, data, or question for a given turn. The agent combines its instructions with your user prompt to generate a response.

Effective prompt engineering requires attention to both surfaces. Good instructions without clear user prompts produce generic responses. Clear user prompts with vague instructions produce inconsistent behavior.

## Write effective agent instructions

Agent instructions are the most important factor in your agent's behavior. They run on every turn, so invest time in getting them right.

### Define the agent's role and scope

Start your instructions with a clear identity statement. Specify the agent's domain, purpose, and boundaries. A well-scoped role reduces inaccurate outputs and off-topic responses.

**Weak instruction:**

```
You are a helpful assistant.
```

**Strong instruction:**

```
You are a computational chemistry research assistant specializing in
molecular dynamics simulations. You help researchers design simulation
parameters, interpret trajectory data, and troubleshoot GROMACS and
AMBER workflows. You don't provide medical advice or drug efficacy
predictions.
```

The strong instruction tells the model exactly what domain to operate in, what tools it works with, and what it shouldn't do.

### Use structured formatting

Organize instructions into clearly labeled sections using Markdown headers or XML tags. Structured instructions reduce drift and improve consistency, especially with GPT-5.x models.

```
# Identity

You are a genomics data analyst for a Discovery research team.
You specialize in RNA-seq differential expression analysis and
pathway enrichment.

# Instructions

- Analyze gene expression data using standard statistical methods
  (DESeq2, edgeR, limma-voom).
- Report fold changes, adjusted p-values, and confidence intervals.
- Flag genes with adjusted p-value < 0.05 and |log2FC| > 1.
- When results are ambiguous, state your assumptions explicitly.
- Don't fabricate gene names, pathway IDs, or citation references.

# Output format

- Present results as Markdown tables with column headers.
- Include a brief interpretation paragraph after each table.
- Use Gene Ontology (GO) term IDs when referencing pathways.
```

### Set explicit output constraints

GPT-5.x models are highly steerable. You get better results when you specify the exact output shape, length, and format you expect.

```
<output_contract>
- Return results as a JSON object with these fields:
  compound_name, smiles, predicted_activity, confidence_score.
- Set confidence_score to null if insufficient data exists.
- Don't add extra fields beyond those listed.
- Keep interpretation summaries under 100 words.
</output_contract>
```

This technique prevents verbose or unpredictable output shapes. It's especially useful for agents whose outputs feed into workflow agents or downstream tools.

### Provide few-shot examples

Include one or more input-output examples in your instructions. Few-shot examples are the most reliable way to show the model your expected behavior. They work better than lengthy descriptions of the desired format.

```
# Examples

<user_query>
What is the binding affinity of ibuprofen to COX-2?
</user_query>

<assistant_response>
Based on published crystallography data, ibuprofen binds to the
COX-2 active site with a Ki of approximately 13 μM. The binding
involves hydrogen bonds with Arg120 and Tyr355 residues.

| Property | Value |
|---|---|
| Target | COX-2 (Cyclooxygenase-2) |
| Ki | ~13 μM |
| Key residues | Arg120, Tyr355 |
| Method | X-ray crystallography |
</assistant_response>
```

Use diverse examples that cover edge cases. If your agent handles both positive and negative results, include examples of both.

### Control reasoning and verbosity

GPT-5.2 and GPT-5.4 models support reasoning effort settings that trade off speed and depth. Match your verbosity and reasoning controls to the agent's purpose.

**For analytical agents** that handle complex reasoning:

```
<reasoning_controls>
- Think step-by-step before presenting conclusions.
- Show your reasoning chain for statistical calculations.
- When comparing hypotheses, list evidence for and against each.
- Keep final summaries under five bullets.
</reasoning_controls>
```

**For routing or classification agents** that need fast, deterministic output:

```
<reasoning_controls>
- Respond with the classification label only.
- Don't include explanations unless the user asks.
- Choose from these categories: [experimental, computational,
  literature-review, data-processing].
</reasoning_controls>
```

### Handle uncertainty and ambiguity

Scientific research often involves incomplete data. Instruct your agent on how to handle uncertainty to reduce the risk of generating incorrect information.

```
<uncertainty_handling>
- If the question is ambiguous, present the two most plausible
  interpretations and answer both.
- When data is insufficient, say "Based on available context..."
  instead of making absolute claims.
- Never fabricate numerical values, citations, DOIs, or gene IDs.
- If a claim requires a source you don't have, state that the
  claim needs verification.
</uncertainty_handling>
```

This pattern is critical for research agents. An ungrounded numerical claim in a scientific context can lead to incorrect experimental decisions.

## Write effective user prompts

User prompts drive each individual interaction. Even with well-configured agent instructions, poor user prompts produce poor results.

### Be specific about the task

Vague prompts produce vague answers. State exactly what you need, including the scope, format, and any constraints.

**Weak prompt:**

```
Tell me about protein folding.
```

**Strong prompt:**

```
Summarize the three main computational approaches to protein
structure prediction (homology modeling, ab initio, and
machine learning-based methods). For each approach, list its
strengths, limitations, and one representative tool. Format
the output as a Markdown table.
```

The strong prompt specifies the scope (three approaches), the dimensions to cover (strengths, limitations, tool), and the output format (table).

### Provide context and data

Include the relevant data, constraints, or background directly in your prompt. The model generates better responses when it has access to the specific information it needs.

```
Here are the HPLC retention times for five candidate compounds:

| Compound | Retention time (min) | Peak area |
|---|---|---|
| CPD-101 | 3.42 | 15200 |
| CPD-102 | 5.18 | 8900 |
| CPD-103 | 3.45 | 14800 |
| CPD-104 | 7.91 | 3200 |
| CPD-105 | 5.20 | 9100 |

Identify compounds with similar retention times that might
indicate co-elution. Suggest a modified gradient to improve
separation.
```

Providing structured data as tables is more token-efficient than JSON or verbose descriptions.

### Break complex tasks into steps

Large, multi-part requests often produce incomplete or shallow responses. Break complex tasks into sequential steps.

**Instead of this:**

```
Analyze the RNA-seq dataset, find differentially expressed genes,
run pathway enrichment, and write a summary for the methods section.
```

**Use this sequential approach:**

```
Step 1: From the attached gene expression matrix, identify
differentially expressed genes using a threshold of adjusted
p-value < 0.05 and |log2 fold change| > 1.

Step 2: For the top 20 upregulated genes, run Gene Ontology
enrichment analysis and list the top five enriched biological
process terms.

Step 3: Draft a two-paragraph methods section describing the
analysis pipeline, suitable for a peer-reviewed publication.
```

Each step builds on the previous one. This approach gives the model a clear execution plan and reduces the chance of skipping components.

### Use cues to prime the output

A cue is a short prefix that steers the model toward the output format you want. Add a cue at the end of your prompt to guide the first tokens of the response.

**Without cue:**

```
What are the key findings from this crystallography dataset?
```

**With cue:**

```
What are the key findings from this crystallography dataset?

Key findings:
1.
```

The cue tells the model to produce a numbered list starting immediately. This technique is especially useful when you need a specific output structure.

### Ask for citations and evidence

Scientific work requires traceable claims. Instruct the model to cite sources and anchor claims to provided context.

```
Based on the three papers provided in the knowledge base,
summarize the current understanding of CRISPR off-target effects
in mammalian cells. Cite each claim using the format
[Author, Year]. If a claim isn't supported by the provided
papers, note it as "requires additional verification."
```

Requiring inline citations forces the model to ground each statement. Claims without citations are more likely to be fabricated.

### Use supporting context effectively

Supporting context helps the model tailor its response to your specific situation. Include relevant constraints like the experimental system, organism, or analysis pipeline.

**Without context:**

```
How should I normalize this gene expression data?
```

**With supporting context:**

```
I'm analyzing bulk RNA-seq data from mouse liver samples
(n=6 per group, paired-end 150bp, ~30M reads per sample).
The samples include three treatment groups and one control.
How should I normalize this data before differential expression
analysis?
```

The supporting context lets the model recommend normalization methods appropriate for the specific experimental design.

## Optimize prompts for GPT-5.x models

GPT-5.2 and GPT-5.4 models have specific characteristics that affect prompt design.

### GPT-5.2 best practices

GPT-5.2 excels at structured reasoning, tool grounding, and multi-step execution. It's more concise by default and follows instructions closely.

- **Set explicit verbosity constraints.** GPT-5.2 respects length limits well. Specify output length in sentences, bullets, or word count.
- **Use structured output schemas.** GPT-5.2 performs well with JSON schemas and structured extraction. Provide the exact schema in your instructions.
- **Control scope drift.** Add explicit boundaries like "Don't expand beyond the requested analysis" to prevent the model from adding unrequested content.

### GPT-5.4 best practices

GPT-5.4 offers a 1,050,000 token context window and stronger performance on long-horizon tasks. It maintains consistency over extended conversations.

- **Use re-grounding for long contexts.** For documents longer than 10,000 tokens, instruct the agent to summarize key sections before answering. This reduces recall errors.
- **Add verification loops.** For multi-step analyses, add a verification instruction: "Before presenting results, check that all requested items are covered and all calculations are consistent."
- **Define completion criteria.** Tell the model what "done" looks like: "The analysis is complete when all five compounds have predicted binding affinities and confidence scores."

### Adjust temperature and Top-P for your use case

Temperature and Top-P settings affect output randomness and diversity. For detailed guidance on configuring these parameters for different agent types, see [Configure a model deployment for your agent](how-to-select-models-for-agents.md#configure-a-model-deployment-for-your-agent).

## Apply prompt patterns for common research tasks

The following patterns address common scientific research scenarios.

### Literature review agent

```
# Identity

You are a scientific literature review assistant specializing
in structural biology and protein engineering.

# Instructions

- Summarize papers using this structure: Objective, Methods,
  Key Findings, Limitations.
- Compare findings across papers when multiple sources are
  provided.
- Flag contradictions between papers explicitly.
- Cite claims using [Author, Year] format anchored to the
  knowledge base documents.
- Don't fabricate DOIs, journal names, or author names.

# Output format

- Use Markdown headers for each paper summary.
- End with a "Cross-paper synthesis" section comparing findings.
- Keep each paper summary under 200 words.
```

### Data analysis agent

```
# Identity

You are a quantitative research analyst for drug discovery
screening data.

# Instructions

- Perform statistical analyses using standard methods
  (t-test, ANOVA, Mann-Whitney U as appropriate).
- Report effect sizes, confidence intervals, and p-values.
- Flag potential confounders or batch effects in the data.
- Use Code Interpreter for calculations. Show the code
  you run.

<output_contract>
- Present numerical results in Markdown tables.
- Round values to three significant figures.
- Include a one-paragraph interpretation after each analysis.
- State all assumptions (normality, equal variance) explicitly.
</output_contract>

<uncertainty_handling>
- If sample size is insufficient for the requested test,
  recommend a non-parametric alternative.
- If results are borderline significant (0.01 < p < 0.05),
  note that replication is recommended.
</uncertainty_handling>
```

### Experiment planning agent

```
# Identity

You are an experimental design consultant for molecular biology
research.

# Instructions

- Design experiments using appropriate controls (positive,
  negative, vehicle).
- Recommend sample sizes based on expected effect sizes
  and power analysis.
- Identify potential confounders and suggest mitigation
  strategies.
- Format protocols as numbered step-by-step procedures.

<reasoning_controls>
- Think through the experimental logic before presenting
  the protocol.
- List assumptions about equipment and reagent availability.
- Highlight steps where timing or temperature is critical.
</reasoning_controls>
```

## Iterate and refine prompts

Prompt engineering is iterative. Use the following workflow to improve your prompts over time.

1. Write an initial prompt and test it in Discovery Studio chat using `@AgentName`.

1. Review the response for accuracy, completeness, and format compliance.

1. Identify gaps. Common issues include:
   - Missing information (add more specific instructions)
   - Fabricated claims (add grounding and citation requirements)
   - Wrong format (add output contract or few-shot examples)
   - Too verbose (add length constraints)
   - Too brief (specify required sections or minimum detail)

1. Make one change at a time and retest. Changing multiple prompt elements simultaneously makes it harder to identify what improved or degraded performance.

1. Save the updated agent. Each save creates a new immutable version with full history.

## Related content

- [Select models for agents in Microsoft Discovery](how-to-select-models-for-agents.md)
- [Agent types in Microsoft Discovery](concept-discovery-agent-types.md)
- [Create agents in Microsoft Discovery](how-to-agent-creation.md)
- [Prompt engineering techniques for Azure OpenAI](/azure/foundry/openai/concepts/prompt-engineering)
