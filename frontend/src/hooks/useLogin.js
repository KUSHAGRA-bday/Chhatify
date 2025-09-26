import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { login } from "../lib/api";
import toast from "react-hot-toast";


const useLogin = () => {
const queryClient = useQueryClient();
  const {
    mutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success("Login successful!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return { mutate, isPending, error };
};

export default useLogin;