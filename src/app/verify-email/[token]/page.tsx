import VerifyEmailPage from "./verifyEmail";

export default async function VerifyEmail({
  params: { token },
}: {
  params: { token: string };
}) {
  return <VerifyEmailPage token={token} />;
}
