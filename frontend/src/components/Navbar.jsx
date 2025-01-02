import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { logout, authUser, isSettingOpen, setIsSettingOpen,isProfileOpen,setIsProfileOpen } = useAuthStore();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">TalkNest</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {!isSettingOpen && (
              <>
                <Link
                  to={"/settings"}
                  className={`
                btn btn-sm gap-2 transition-colors
                
                `}
                  onClick={setIsSettingOpen}
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Link>
              </>
            )}
            {isSettingOpen &&  (
              <>
                <Link
                  to={"/"}
                  className={`
                btn btn-sm gap-2 transition-colors
                on
                `}
                  onClick={setIsSettingOpen}
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Close</span>
                </Link>
              </>
            )}

            {authUser && !isProfileOpen &&
              
                <Link to={"/profile"} className={`btn btn-sm gap-2`}
                onClick={setIsProfileOpen}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                }

{isProfileOpen &&  (
              <>
                <Link
                  to={"/"}
                  className={`
                btn btn-sm gap-2 transition-colors
                on
                `}
                  onClick={setIsProfileOpen}
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Close</span>
                </Link>
              </>
            )}

                 {authUser && 
                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
