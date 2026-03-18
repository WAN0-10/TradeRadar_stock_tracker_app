import NavItems from "./nav_items";
import Image from "next/image";
import Link from "next/link";
import UserDropDown from "../user_dropdown";

const Header = () => {
  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper flex items-center justify-between">
        <Link href="/">
          <Image
            src="/assets/icons/logo.svg"
            alt="Trade Radar Logo"
            width={140}
            height={32}
            className="h-8 w-auto cursor-pointer"
          />
        </Link>
        <nav className="hidden sm:block">
          <NavItems />
        </nav>

        <UserDropDown />
      </div>
    </header>
  );
};

export default Header;
