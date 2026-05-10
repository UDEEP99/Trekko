import { type NextAuthOptions } from "next-auth";

/**
 * NextAuth configuration for IBM App ID (OpenID Connect).
 *
 * IBM App ID exposes a standard OIDC-compliant discovery endpoint at
 * `{oauthServerUrl}/.well-known/openid-configuration`, which the generic
 * OIDC provider in next-auth can consume automatically.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "appid",
      name: "IBM App ID",
      type: "oauth",
      wellKnown: `${process.env.APPID_ISSUER}/.well-known/openid-configuration`,
      clientId: process.env.APPID_CLIENT_ID,
      clientSecret: process.env.APPID_CLIENT_SECRET,
      idToken: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username ?? profile.email,
          email: profile.email,
        };
      },
    },
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, persist user info into the JWT
      if (user) {
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      // Pass name & email from JWT into the client-side session object
      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
};
