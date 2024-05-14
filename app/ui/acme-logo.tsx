import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";

export default function Logo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <p className="text-[24px] hidden md:block">Fencing Pool</p>
      <p className="md:hidden text-[20px]">Fencing Pool</p>
    </div>
  );
}
