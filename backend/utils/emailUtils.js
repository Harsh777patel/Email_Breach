const { XposedOrNot } = require("xposedornot");

const xon = new XposedOrNot();

const checkEmailBreach = async (email) => {
  const lowerEmail = email.trim().toLowerCase();

  try {
    // Check email for breaches using XposedOrNot package
    // result.found (boolean) tells us if the email was in any breach
    // result.breaches is a string[] of breach names e.g. ["Adobe", "LinkedIn"]
    const result = await xon.checkEmail(lowerEmail);

    // If not found in any breach, return clean status
    if (!result.found) {
      return {
        email: lowerEmail,
        breached: false,
        breaches: [],
        riskLevel: "Low",
        riskScore: 0,
        metrics: null,
        recommendations: [
          "Continue using a unique, strong password.",
          "Enable account alerts and two-factor authentication.",
          "Regularly monitor your accounts for suspicious activity.",
        ],
      };
    }

    // Map breach names (string[]) to breach detail objects
    const breachDetails = (result.breaches || []).map((name) => ({
      breachName: name,
      domain: null,
      industry: null,
      year: null,
      exposedRecords: null,
      exposedData: ["Email", "Account Info"],
      passwordRisk: null,
      verified: null,
      description: null,
    }));

    const breachCount = breachDetails.length;
    const riskLabel =
      breachCount > 5 ? "Very High" :
      breachCount > 3 ? "High" :
      breachCount > 1 ? "Medium" : "Low";

    const riskScore = Math.min(100, breachCount * 15);
    const pasteCount = result.pasteCount || 0;

    const recommendations = buildRecommendations({
      riskLabel,
      breachCount,
      pasteCount,
    });

    return {
      email: lowerEmail,
      breached: true,
      breaches: breachDetails,
      riskLevel: riskLabel,
      riskScore,
      metrics: {
        breachCount,
        pasteCount,
      },
      recommendations,
    };
  } catch (error) {
    // 404 from XposedOrNot = email not found in any breach (safe)
    if (error.status === 404 || error.code === 404 || error?.response?.status === 404) {
      return {
        email: lowerEmail,
        breached: false,
        breaches: [],
        riskLevel: "Low",
        riskScore: 0,
        metrics: null,
        recommendations: [
          "Continue using a unique, strong password.",
          "Enable account alerts and two-factor authentication.",
          "Regularly monitor your accounts for suspicious activity.",
        ],
      };
    }

    // Rate limit hit (429)
    if (error.status === 429 || error.code === 429 || error?.response?.status === 429) {
      throw new Error("Rate limit exceeded. XposedOrNot allows ~2 requests per second.");
    }

    throw new Error(`XposedOrNot API error: ${error.message}`);
  }
};

const buildRecommendations = ({ riskLabel, pasteCount, breachCount }) => {
  const recs = [];

  if (riskLabel === "High" || riskLabel === "Very High" || breachCount > 3) {
    recs.push("Change your passwords immediately on all affected accounts.");
    recs.push("Enable two-factor authentication on all important accounts.");
  } else {
    recs.push("Change your password on the affected account(s) as a precaution.");
    recs.push("Enable two-factor authentication for added security.");
  }

  if (pasteCount > 0) {
    recs.push(`Your data appeared in ${pasteCount} paste leak(s) — monitor for phishing attempts.`);
  }

  recs.push("Use a password manager to maintain unique passwords per account.");
  recs.push("Check other accounts that share the same email or password.");

  return recs;
};

module.exports = {
  checkEmailBreach,
};
