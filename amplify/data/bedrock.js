export function request(ctx) {
    const { ingredients = [], model = "" } = ctx.args;
    console.log("ingredients", ingredients);
    console.log("model", model);

    // Construct the prompt with the provided ingredients
    const prompt = `Suggest a recipe idea using these ingredients: ${ingredients.join(", ")}.`;

    // Return the request configuration
    if (model === "amazon_titan_text_g1_express") {
      return {
        resourcePath: `/model/amazon.titan-text-express-v1/invoke`,
        method: "POST",
        params: {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            "inputText": `\n\nHuman: ${prompt}\n\nAssistant:`,
            "textGenerationConfig": {
              "maxTokenCount": 8192,
              "stopSequences": [],
              "temperature": 0,
              "topP": 1
            }
          }),
        },
      };
    }
    if (model === "llama_3_8b_instruct") {
      return {
        resourcePath: `/model/meta.llama3-8b-instruct-v1:0/invoke`,
        method: "POST",
        params: {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "prompt": `\n\nHuman: ${prompt}\n\nAssistant:`,
            "max_gen_len": 512,
            "temperature": 0.5,
            "top_p": 0.9
          }),
        },
      };
    }
    if (model === "cohere_command_r") {
      return {
        resourcePath: `/model/cohere.command-r-v1:0/invoke`,
        method: "POST",
        params: {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "message": `\n\nHuman: ${prompt}\n\nAssistant:`
          }),
        },
      };
    }
    if (model === "anthropic_claude_3_sonnet") {
      return {
        resourcePath: `/model/anthropic.claude-3-sonnet-20240229-v1:0/invoke`,
        method: "POST",
        params: {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 1000,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: `\n\nHuman: ${prompt}\n\nAssistant:`,
                  },
                ],
              },
            ],
          }),
        },
      };
    }
  }

  export function response(ctx) {
    // Parse the response body
    const parsedBody = JSON.parse(ctx.result.body);
    console.log("parsedBody", parsedBody);
    // Extract the text content from the response
    const res = {
      body: parsedBody.content?.[0].text || parsedBody.message,
    };
    // Return the response
    return res;
  }