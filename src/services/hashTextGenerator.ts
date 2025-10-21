import bcrypt from "bcryptjs";

export const hashTextGenerator = async (text: string) => {
  const hashtext = await bcrypt.hashSync(text);
  return hashtext;
};
