// Leaderboard API Worker Script

// GitHub repository details
const OWNER = '2187Nick';  // Replace with your GitHub username
const REPO = '2187Nick.github.io';

// Main event handler
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return handleCORS();
  }

  // Only accept POST requests for score submission
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders()
    });
  }

  try {
    const { nickname, score } = await request.json();
    
    // Validate the score submission
    if (!nickname || !score || typeof score !== 'number' || score <= 0) {
      return new Response(JSON.stringify({ 
        error: 'Invalid score submission. Required: nickname (string) and score (positive number)' 
      }), { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders()
        } 
      });
    }

    // Submit score to GitHub via repository_dispatch event
    const result = await submitScoreToGitHub(nickname, score);
    
    if (!result.success) {
      return new Response(JSON.stringify({ error: result.message }), { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders()
        } 
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Score submitted successfully' 
    }), { 
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders()
      } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Error processing request', 
      details: error.message 
    }), { 
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders()
      } 
    });
  }
}

// Submit score to GitHub by triggering a repository_dispatch event
async function submitScoreToGitHub(nickname, score) {
  try {
    // DEPLOYMENT INSTRUCTIONS:
    // 1. Create a GitHub Personal Access Token with 'repo' scope
    // 2. In Cloudflare Workers, add a Secret named GITHUB_PAT with your token
    // 3. Uncomment the line below to use the secret in production
    // const GITHUB_TOKEN = GITHUB_PAT; // Access from environment variable
    
    // For deployment: Replace this empty string with your GitHub Personal Access Token
    // or preferably use the Cloudflare Workers secret approach above
    const GITHUB_TOKEN = ''; // Replace with your GitHub PAT or use the environment variable
    
    if (!GITHUB_TOKEN) {
      return { 
        success: false, 
        message: 'GitHub token not configured. Please set up the worker with a valid token.' 
      };
    }
    
    const response = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/dispatches`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: 'new-score',
          client_payload: {
            nick: nickname,
            score: score
          }
        })
      }
    );

    if (response.status === 204) {
      return { success: true };
    } else {
      const errorText = await response.text();
      return { 
        success: false, 
        message: `GitHub API error: ${response.status} - ${errorText}` 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      message: `Failed to submit score: ${error.message}` 
    };
  }
}

// Helper for CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

// Handle CORS preflight
function handleCORS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  });
}
